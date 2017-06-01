import serial, multiprocessing, time, os
import tornado.httpserver, tornado.websocket, tornado

clients = []
comReadQueue = multiprocessing.Queue()
comWriteQueue = multiprocessing.Queue()

class ArduinoComm(multiprocessing.Process):
    def __init__(self, readQueue, writeQueue):
        multiprocessing.Process.__init__(self)
        self.readQueue = readQueue
        self.writeQueue = writeQueue
        ''' Initializing Connection '''
        try:
            ## CHANGE SERIAL PORT HERE ##
            ## CHANGE SERIAL PORT HERE ##
            ## CHANGE SERIAL PORT HERE ##
            self.arduino = serial.Serial('/dev/cu.usbmodem1421', 9600, timeout=1)
            ## CHANGE SERIAL PORT HERE ##
            ## CHANGE SERIAL PORT HERE ##
            ## CHANGE SERIAL PORT HERE ##
            print('Initializing Connection...')
            self.arduino.write(b'P')
            while(self.arduino.read() != b'P'):
                self.arduino.write(b'P')
            self.arduino.write(b'V')
            print('Successfully connected to %s' % self.arduino.readline().decode('UTF-8').strip())
        except FileNotFoundError:
            print('Cannot connect to Arduino.')
        except serial.serialutil.SerialException:
            print('Cannot connect to Arduino.')

    def close(self):
        self.arduino.close()
    
    def run(self):
        self.arduino.flushInput()
        while True:
            try:
                if(not self.writeQueue.empty()):
                    message = self.writeQueue.get().encode('ascii')
                    print('COM Write %s' % message)
                    self.arduino.write(message)
                if(self.arduino.inWaiting() > 0):
                    message = self.arduino.readline().decode('ascii').strip()
                    print('COM Read %s' % message)
                    self.readQueue.put(message)
            except serial.serialutil.SerialException:
                pass
            time.sleep(0.01)
    
class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('htdocs/ttl.html')


class ArduinoTunnel(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        clients.append(self)

    def on_message(self, message):
        print('WS Recv %s' % message)
        comWriteQueue.put(message)

    def on_close(self):
        clients.remove(self)

def broadcastMessage():
    if(not comReadQueue.empty()):
        message = comReadQueue.get()
        print('WS Send %s' % message)
        for client in clients:
            client.write_message(message)


''' Starting WebSocket Server '''
'''http://fabacademy.org/archives/2015/doc/WebSocketConsole.html'''
aComm = ArduinoComm(comReadQueue, comWriteQueue)
aComm.daemon = True
aComm.start()
wsServer = tornado.web.Application(
    handlers = [
        (r"/", IndexHandler),
        (r"/ws", ArduinoTunnel),
        (r"/(.*)", tornado.web.StaticFileHandler, {'path':  'htdocs/'}),
    ]
)
httpServer = tornado.httpserver.HTTPServer(wsServer)
httpServer.listen(8999)
tornadoLoop = tornado.ioloop.IOLoop.instance()
tunnelLoop = tornado.ioloop.PeriodicCallback(broadcastMessage, 10, io_loop = tornadoLoop)
tunnelLoop.start()
os.system("open http://127.0.0.1:8999")
tornadoLoop.start()
