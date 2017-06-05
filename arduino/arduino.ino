/* Digital circuit connection pins*/
int outPin1 = 2;
int outPin2 = 3;
int outPin3 = 4;
int outPin4 = 5;
int inPin = 6;

void setup() {
    digitalWrite(13, LOW);
    Serial.begin(9600);
    while(!Serial) { delay(1); }
    digitalWrite(13, HIGH);
}

void loop() {
    int sRead = serialRead();
    int newPin, chPin;
    switch(sRead) {
        case 'P':
            /* Ping */
            Serial.print("P\n");
            break;
        case 'V':
            /* Show version */
            Serial.print("TTL Test\n");
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            test(sRead - '0');
            break;
        case 'C':
            /* Change Output Port ID */
            chPin = serialRead() - '0';
            newPin = serialRead() - '0';
            /*  /: -1 (Disabled)
             *  0-1: Reserved for COM
             *  2-9: As shown
             *  : : 10
             *  ; : 11
             *  < : 12
             *  = : 13
             *  > : 14 (A0)
             *  ? : 15 (A1)
             *  @ : 16 (A2)
             *  A : 17 (A3)
             *  B : 18 (A4)
             *  C : 19 (A5)
             */
            if(newPin < 2) newPin = -1;
            if(newPin > 19) newPin = -1;
            switch(chPin) {
                case 1: outPin1 = newPin; break;
                case 2: outPin2 = newPin; break;
                case 3: outPin3 = newPin; break;
                case 4: outPin4 = newPin; break;
                case 5: inPin = newPin; break;
            }
            registerPins();
            break;
        case 'S':
            /* Show Port Status */
            Serial.print(outPin1);
            Serial.print('/');
            Serial.print(outPin2);
            Serial.print('/');
            Serial.print(outPin3);
            Serial.print('/');
            Serial.print(outPin4);
            Serial.print('/');
            Serial.print(inPin);
            Serial.print('\n');
            registerPins();
            break;
        case 'H':
            /* Manually set high an output */
            /* Pin definition see above */
            newPin = serialRead() - '0';
            pinMode(newPin, OUTPUT);
            analogWrite(newPin, 255);
            break;
        case 'L':
            /* Manually set low an output */
            /* Pin definition see above */
            newPin = serialRead() - '0';
            pinMode(newPin, OUTPUT);
            analogWrite(newPin, 0);
            break;
        case 'R':
            /* Manually read from input */
            /* Pin definition see above */
            newPin = serialRead() - '0';
            pinMode(newPin, INPUT);
            delay(50);
            Serial.print(digitalRead(newPin));
            Serial.print('\n');
            break;
    }
    Serial.flush();
}

char serialRead() {
    while(!Serial.available()) {}
    return Serial.read();
}

void registerPins() {
    pinMode(outPin1, OUTPUT);
    analogWrite(outPin1, 0);
    pinMode(outPin2, OUTPUT);
    analogWrite(outPin2, 0);
    pinMode(outPin3, OUTPUT);
    analogWrite(outPin3, 0);
    pinMode(outPin4, OUTPUT);
    analogWrite(outPin4, 0);
    pinMode(inPin, OUTPUT);
    analogWrite(inPin, 0);
    pinMode(inPin, INPUT);
}

void test(int testPorts) {
    int testSize = ceil(pow(2, testPorts));
    int outSet[4];
    outSet[0] = 1;
    outSet[1] = 1;
    outSet[2] = 1;
    outSet[3] = 1;
    int i, j;
    for(i = 0; i < testSize; i++) {
        outSet[0] ++;
        j = 0;
        while(outSet[j] >= 2 && j < testPorts) {
            outSet[j] = 0;
            j++;
            if(j < testPorts) outSet[j] ++;
        }
        if(outPin1 >= 0) analogWrite(outPin1, outSet[0] * 255);
        if(outPin2 >= 0) analogWrite(outPin2, outSet[1] * 255);
        if(outPin3 >= 0) analogWrite(outPin3, outSet[2] * 255);
        if(outPin4 >= 0) analogWrite(outPin4, outSet[3] * 255);
        delay(50);
        Serial.print(digitalRead(inPin));
    }
    Serial.print('\n');
}

