var chip = [
    {
        'name': 'NAND2 - SN[54/74]00 Series',
        'img': '7400.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [1,2],
            'readFrom': 3,
            'result': '1110'
        }, {
            'writeTo': [4,5],
            'readFrom': 6,
            'result': '1110'
        }, {
            'writeTo': [13,12],
            'readFrom': 11,
            'result': '1110'
        }, {
            'writeTo': [10,9],
            'readFrom': 8,
            'result': '1110'
        }]
    },
    {
        'name': 'NOR2 - SN[54/74]02 Series',
        'img': '7402.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [2,3],
            'readFrom': 1,
            'result': '1000'
        }, {
            'writeTo': [5,6],
            'readFrom': 4,
            'result': '1000'
        }, {
            'writeTo': [12,11],
            'readFrom': 13,
            'result': '1000'
        }, {
            'writeTo': [9,8],
            'readFrom': 10,
            'result': '1000'
        }]
    },
    {
        'name': 'NOT - SN[54/74]04 Series',
        'img': '7404.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [1],
            'readFrom': 2,
            'result': '10'
        },{
            'writeTo': [3],
            'readFrom': 4,
            'result': '10'
        },{
            'writeTo': [5],
            'readFrom': 6,
            'result': '10'
        },{
            'writeTo': [13],
            'readFrom': 12,
            'result': '10'
        },{
            'writeTo': [11],
            'readFrom': 10,
            'result': '10'
        },{
            'writeTo': [9],
            'readFrom': 8,
            'result': '10'
        }]
    },
    {
        'name': 'NAND3 - SN[54/74]10 Series',
        'img': '7410.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [1,2,13],
            'readFrom': 12,
            'result': '11111110'
        },{
            'writeTo': [3,4,5],
            'readFrom': 6,
            'result': '11111110'
        },{
            'writeTo': [11,10,9],
            'readFrom': 8,
            'result': '11111110'
        }]
    },
    {
        'name': 'NAND4 - SN[54/74]20 Series',
        'img': '7420.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [1,2,4,5],
            'readFrom': 6,
            'result': '1111111111111110'
        },{
            'writeTo': [13,12,10,9],
            'readFrom': 8,
            'result': '1111111111111110'
        }]
    },
    {
        'name': 'NOR3 - SN[54/74]27 Series',
        'img': '7427.png',
        'type': 'general',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [{
            'writeTo': [1,2,13],
            'readFrom': 12,
            'result': '10000000'
        },{
            'writeTo': [3,4,5],
            'readFrom': 6,
            'result': '10000000'
        },{
            'writeTo': [11,10,9],
            'readFrom': 8,
            'result': '10000000'
        }]
    },
    {
        'name': 'DFF - SN[54/74]74 Series',
        'img': '7474.png',
        'type': 'direct',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'/',
            8:'8',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'/'
        },
        'set': [
            /* DFF left-bottom */
            { /* DFF: Preset to HIGH */
                'comment': 'LEFT: Preset to HIGH, test Q',
                'setHigh': [1], 'setLow': [2,3,4], 'readFrom': 5, 'result': 1
            },{ /* DFF: Preset to HIGH, test invert */
                'comment': 'LEFT: Preset to HIGH, test Q\'',
                'setHigh': [1], 'setLow': [2,3,4], 'readFrom': 6, 'result': 0
            },{ /* DFF: Preset to LOW */
                'comment': 'LEFT: Preset to LOW, test Q',
                'setHigh': [4], 'setLow': [1,2,3], 'readFrom': 5, 'result': 0
            },{ /* DFF: Preset to LOW, test invert */
                'comment': 'LEFT: Preset to LOW, test Q\'',
                'setHigh': [4], 'setLow': [1,2,3], 'readFrom': 6, 'result': 1
            },{ /* DFF: Set HIGH, Prepare for CLK tick */
                'comment': 'LEFT: Set to HIGH, no tick',
                'setHigh': [1,2,4], 'setLow': [3], 'readFrom': 5, 'result': 0
            },{ /* DFF: Set HIGH, CLK tick */
                'comment': 'LEFT: Set to HIGH, CLK tick',
                'setHigh': [1,2,3,4], 'setLow': [], 'readFrom': 5, 'result': 1
            },{ /* DFF: Set LOW, Prepare for CLK tick */
                'comment': 'LEFT: Set to LOW, no tick',
                'setHigh': [1,4], 'setLow': [2,3], 'readFrom': 5, 'result': 1
            },{ /* DFF: Set LOW, CLK tick */
                'comment': 'LEFT: Set to LOW, CLK tick',
                'setHigh': [1,3,4], 'setLow': [2], 'readFrom': 5, 'result': 0
            },
            /* DFF top-right */
            { /* DFF: Preset to HIGH */
                'comment': 'RIGHT: Preset to HIGH, test Q',
                'setHigh': [13], 'setLow': [12,11,10], 'readFrom': 9, 'result': 1
            },{ /* DFF: Preset to HIGH, test invert \*/
                'comment': 'RIGHT: Preset to HIGH, test Q\'',
                'setHigh': [13], 'setLow': [12,11,10], 'readFrom': 8, 'result': 0
            },{ /* DFF: Preset to LOW \*/
                'comment': 'RIGHT: Preset to LOW, test Q',
                'setHigh': [10], 'setLow': [13,12,11], 'readFrom': 9, 'result': 0
            },{ /* DFF: Preset to LOW, test invert \*/
                'comment': 'RIGHT: Preset to LOW, test Q\'',
                'setHigh': [10], 'setLow': [13,12,11], 'readFrom': 8, 'result': 1
            },{ /* DFF: Set HIGH, Prepare for CLK tick \*/
                'comment': 'RIGHT: Set to HIGH, no tick',
                'setHigh': [13,12,10], 'setLow': [11], 'readFrom': 9, 'result': 0
            },{ /* DFF: Set HIGH, CLK tick \*/
                'comment': 'RIGHT: Set to HIGH, CLK tick',
                'setHigh': [13,12,11,10], 'setLow': [], 'readFrom': 9, 'result': 1
            },{ /* DFF: Set LOW, Prepare for CLK tick \*/
                'comment': 'RIGHT: Set to LOW, no tick',
                'setHigh': [13,10], 'setLow': [12,11], 'readFrom': 9, 'result': 1
            },{ /* DFF: Set LOW, CLK tick \*/
                'comment': 'RIGHT: Set to LOW, CLK tick',
                'setHigh': [13,11,10], 'setLow': [12], 'readFrom': 9, 'result': 0
            }
        ]
    },
    {
        'name': 'DFF - SN[54/74]175 Series',
        'img': '74175.png',
        'type': 'direct',
        'pinPort': {
            1:'2',
            2:'3',
            3:'4',
            4:'5',
            5:'6',
            6:'7',
            7:'8',
            8:'/',
            9:'9',
            10:':',
            11:';',
            12:'<',
            13:'=',
            14:'>',
            15:'?',
            16:'/'
        },
        'set': [
            /* Test clearing and inverted output */
            {
                'comment': 'LEFT-BOTTOM: Clear, test Q',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 2, 'result': 0
            },
            {
                'comment': 'LEFT-BOTTOM: Clear, test Q\'',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 3, 'result': 1
            },
            {
                'comment': 'RIGHT-BOTTOM: Clear, test Q',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 7, 'result': 0
            },
            {
                'comment': 'RIGHT-BOTTOM: Clear, test Q\'',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 6, 'result': 1
            },
            {
                'comment': 'RIGHT-TOP: Clear, test Q',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 10, 'result': 0
            },
            {
                'comment': 'RIGHT-TOP: Clear, test Q\'',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 11, 'result': 1
            },
            {
                'comment': 'LEFT-TOP: Clear, test Q',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 15, 'result': 0
            },
            {
                'comment': 'LEFT-TOP: Clear, test Q\'',
                'setHigh': [], 'setLow': [1,4,5,9,12,13], 'readFrom': 14, 'result': 1
            },
            /* Test HIGH, before tick */
            {
                'comment': 'LEFT-BOTTOM: HIGH, no tick',
                'setHigh': [1,4,5,12,13], 'setLow': [9], 'readFrom': 2, 'result': 0
            },
            {
                'comment': 'RIGHT-BOTTOM: HIGH, no tick',
                'setHigh': [1,4,5,12,13], 'setLow': [9], 'readFrom': 7, 'result': 0
            },
            {
                'comment': 'RIGHT-TOP: HIGH, no tick',
                'setHigh': [1,4,5,12,13], 'setLow': [9], 'readFrom': 10, 'result': 0
            },
            {
                'comment': 'LEFT-TOP: HIGH, no tick',
                'setHigh': [1,4,5,12,13], 'setLow': [9], 'readFrom': 15, 'result': 0
            },
            /* Test HIGH, after tick */
            {
                'comment': 'LEFT-BOTTOM: HIGH, CLK tick',
                'setHigh': [1,4,5,9,12,13], 'setLow': [], 'readFrom': 2, 'result': 1
            },
            {
                'comment': 'RIGHT-BOTTOM: HIGH, CLK tick',
                'setHigh': [1,4,5,9,12,13], 'setLow': [], 'readFrom': 7, 'result': 1
            },
            {
                'comment': 'RIGHT-TOP: HIGH, CLK tick',
                'setHigh': [1,4,5,9,12,13], 'setLow': [], 'readFrom': 10, 'result': 1
            },
            {
                'comment': 'LEFT-TOP: HIGH, CLK tick',
                'setHigh': [1,4,5,9,12,13], 'setLow': [], 'readFrom': 15, 'result': 1
            },
            /* Test LOW, before tick */
            {
                'comment': 'LEFT-BOTTOM: LOW, no tick',
                'setHigh': [1], 'setLow': [4,5,9,12,13], 'readFrom': 2, 'result': 1
            },
            {
                'comment': 'RIGHT-BOTTOM: LOW, no tick',
                'setHigh': [1], 'setLow': [4,5,9,12,13], 'readFrom': 7, 'result': 1
            },
            {
                'comment': 'RIGHT-TOP: LOW, no tick',
                'setHigh': [1], 'setLow': [4,5,9,12,13], 'readFrom': 10, 'result': 1
            },
            {
                'comment': 'LEFT-TOP: LOW, no tick',
                'setHigh': [1], 'setLow': [4,5,9,12,13], 'readFrom': 15, 'result': 1
            },
            /* Test LOW, after tick */
            {
                'comment': 'LEFT-BOTTOM: LOW, CLK tick',
                'setHigh': [1,9], 'setLow': [4,5,12,13], 'readFrom': 2, 'result': 0
            },
            {
                'comment': 'RIGHT-BOTTOM: LOW, CLK tick',
                'setHigh': [1,9], 'setLow': [4,5,12,13], 'readFrom': 7, 'result': 0
            },
            {
                'comment': 'RIGHT-TOP: LOW, CLK tick',
                'setHigh': [1,9], 'setLow': [4,5,12,13], 'readFrom': 10, 'result': 0
            },
            {
                'comment': 'LEFT-TOP: LOW, CLK tick',
                'setHigh': [1,9], 'setLow': [4,5,12,13], 'readFrom': 15, 'result': 0
            }
        ]
    }
];