extendTable = {
    '0000' : '0',
    '1111' : '1',
    '0101' : "P1",
    '1010' : "P1'",
    '0011' : "P2",
    '1100' : "P2'",
}

def sopOr(k1, v1, k2, v2):
    k = ""
    for i in range(len(k1)):
        if(k1[i] == '1' or k2[i] == '1'):
            k += '1'
        else:
            k += '0'
    if(k in extendTable.keys()):
        if(len(extendTable[k]) <= len(v1 + " + " + v2)):
            return
    extendTable[k] = v1 + " + " + v2

def sopAnd(k1, v1, k2, v2):
    if(v1.find('+') >= 0):
        return
    if(v2.find('+') >= 0):
        return
    k = ""
    for i in range(len(k1)):
        if(k1[i] == '1' and k2[i] == '1'):
            k += '1'
        else:
            k += '0'
    if(k in extendTable.keys()):
        if(len(extendTable[k]) <= len(v1 + " * " + v2)):
            return
    extendTable[k] = v1 + " * " + v2
for i in range(5):
    t = list(extendTable.keys())
    for a in t:
        for b in t:
            if(a != b):
                sopOr(a, extendTable[a], b, extendTable[b])
                sopAnd(a, extendTable[a], b, extendTable[b])
t = list(extendTable.keys())
t.sort()
for a in t:
    print("\"%s\": \"%s\"," % (a, extendTable[a]))
