/**
 * Created by Administrator on 2017/7/13.
 */



const citys= {
  "provinceList": [
    {
      "id": 1,
      "code": "110000",
      "name": "北京市",
      "city": [
        {
          "id": 1,
          "code": "110100",
          "name": "市辖区",
          "citycode": "110000",
          "district": [
            {
              "id": 1,
              "code": "110101",
              "name": "东城区",
              "areacode": "110100"
            },
            {
              "id": 2,
              "code": "110102",
              "name": "西城区",
              "areacode": "110100"
            },
            {
              "id": 3,
              "code": "110103",
              "name": "崇文区",
              "areacode": "110100"
            },
            {
              "id": 4,
              "code": "110104",
              "name": "宣武区",
              "areacode": "110100"
            },
            {
              "id": 5,
              "code": "110105",
              "name": "朝阳区",
              "areacode": "110100"
            },
            {
              "id": 6,
              "code": "110106",
              "name": "丰台区",
              "areacode": "110100"
            },
            {
              "id": 7,
              "code": "110107",
              "name": "石景山区",
              "areacode": "110100"
            },
            {
              "id": 8,
              "code": "110108",
              "name": "海淀区",
              "areacode": "110100"
            },
            {
              "id": 9,
              "code": "110109",
              "name": "门头沟区",
              "areacode": "110100"
            },
            {
              "id": 10,
              "code": "110111",
              "name": "房山区",
              "areacode": "110100"
            },
            {
              "id": 11,
              "code": "110112",
              "name": "通州区",
              "areacode": "110100"
            },
            {
              "id": 12,
              "code": "110113",
              "name": "顺义区",
              "areacode": "110100"
            },
            {
              "id": 13,
              "code": "110114",
              "name": "昌平区",
              "areacode": "110100"
            },
            {
              "id": 14,
              "code": "110115",
              "name": "大兴区",
              "areacode": "110100"
            },
            {
              "id": 15,
              "code": "110116",
              "name": "怀柔区",
              "areacode": "110100"
            },
            {
              "id": 16,
              "code": "110117",
              "name": "平谷区",
              "areacode": "110100"
            }
          ]
        },
        {
          "id": 2,
          "code": "110200",
          "name": "县",
          "citycode": "110000",
          "district": [
            {
              "id": 17,
              "code": "110228",
              "name": "密云县",
              "areacode": "110200"
            },
            {
              "id": 18,
              "code": "110229",
              "name": "延庆县",
              "areacode": "110200"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "code": "120000",
      "name": "天津市",
      "city": [
        {
          "id": 3,
          "code": "120100",
          "name": "市辖区",
          "citycode": "120000",
          "district": [
            {
              "id": 19,
              "code": "120101",
              "name": "和平区",
              "areacode": "120100"
            },
            {
              "id": 20,
              "code": "120102",
              "name": "河东区",
              "areacode": "120100"
            },
            {
              "id": 21,
              "code": "120103",
              "name": "河西区",
              "areacode": "120100"
            },
            {
              "id": 22,
              "code": "120104",
              "name": "南开区",
              "areacode": "120100"
            },
            {
              "id": 23,
              "code": "120105",
              "name": "河北区",
              "areacode": "120100"
            },
            {
              "id": 24,
              "code": "120106",
              "name": "红桥区",
              "areacode": "120100"
            },
            {
              "id": 25,
              "code": "120107",
              "name": "塘沽区",
              "areacode": "120100"
            },
            {
              "id": 26,
              "code": "120108",
              "name": "汉沽区",
              "areacode": "120100"
            },
            {
              "id": 27,
              "code": "120109",
              "name": "大港区",
              "areacode": "120100"
            },
            {
              "id": 28,
              "code": "120110",
              "name": "东丽区",
              "areacode": "120100"
            },
            {
              "id": 29,
              "code": "120111",
              "name": "西青区",
              "areacode": "120100"
            },
            {
              "id": 30,
              "code": "120112",
              "name": "津南区",
              "areacode": "120100"
            },
            {
              "id": 31,
              "code": "120113",
              "name": "北辰区",
              "areacode": "120100"
            },
            {
              "id": 32,
              "code": "120114",
              "name": "武清区",
              "areacode": "120100"
            },
            {
              "id": 33,
              "code": "120115",
              "name": "宝坻区",
              "areacode": "120100"
            }
          ]
        },
        {
          "id": 4,
          "code": "120200",
          "name": "县",
          "citycode": "120000",
          "district": [
            {
              "id": 34,
              "code": "120221",
              "name": "宁河县",
              "areacode": "120200"
            },
            {
              "id": 35,
              "code": "120223",
              "name": "静海县",
              "areacode": "120200"
            },
            {
              "id": 36,
              "code": "120225",
              "name": "蓟　县",
              "areacode": "120200"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "code": "130000",
      "name": "河北省",
      "city": [
        {
          "id": 5,
          "code": "130100",
          "name": "石家庄市",
          "citycode": "130000",
          "district": [
            {
              "id": 37,
              "code": "130101",
              "name": "市辖区",
              "areacode": "130100"
            },
            {
              "id": 38,
              "code": "130102",
              "name": "长安区",
              "areacode": "130100"
            },
            {
              "id": 39,
              "code": "130103",
              "name": "桥东区",
              "areacode": "130100"
            },
            {
              "id": 40,
              "code": "130104",
              "name": "桥西区",
              "areacode": "130100"
            },
            {
              "id": 41,
              "code": "130105",
              "name": "新华区",
              "areacode": "130100"
            },
            {
              "id": 42,
              "code": "130107",
              "name": "井陉矿区",
              "areacode": "130100"
            },
            {
              "id": 43,
              "code": "130108",
              "name": "裕华区",
              "areacode": "130100"
            },
            {
              "id": 44,
              "code": "130121",
              "name": "井陉县",
              "areacode": "130100"
            },
            {
              "id": 45,
              "code": "130123",
              "name": "正定县",
              "areacode": "130100"
            },
            {
              "id": 46,
              "code": "130124",
              "name": "栾城县",
              "areacode": "130100"
            },
            {
              "id": 47,
              "code": "130125",
              "name": "行唐县",
              "areacode": "130100"
            },
            {
              "id": 48,
              "code": "130126",
              "name": "灵寿县",
              "areacode": "130100"
            },
            {
              "id": 49,
              "code": "130127",
              "name": "高邑县",
              "areacode": "130100"
            },
            {
              "id": 50,
              "code": "130128",
              "name": "深泽县",
              "areacode": "130100"
            },
            {
              "id": 51,
              "code": "130129",
              "name": "赞皇县",
              "areacode": "130100"
            },
            {
              "id": 52,
              "code": "130130",
              "name": "无极县",
              "areacode": "130100"
            },
            {
              "id": 53,
              "code": "130131",
              "name": "平山县",
              "areacode": "130100"
            },
            {
              "id": 54,
              "code": "130132",
              "name": "元氏县",
              "areacode": "130100"
            },
            {
              "id": 55,
              "code": "130133",
              "name": "赵　县",
              "areacode": "130100"
            },
            {
              "id": 56,
              "code": "130181",
              "name": "辛集市",
              "areacode": "130100"
            },
            {
              "id": 57,
              "code": "130182",
              "name": "藁城市",
              "areacode": "130100"
            },
            {
              "id": 58,
              "code": "130183",
              "name": "晋州市",
              "areacode": "130100"
            },
            {
              "id": 59,
              "code": "130184",
              "name": "新乐市",
              "areacode": "130100"
            },
            {
              "id": 60,
              "code": "130185",
              "name": "鹿泉市",
              "areacode": "130100"
            }
          ]
        },
        {
          "id": 6,
          "code": "130200",
          "name": "唐山市",
          "citycode": "130000",
          "district": [
            {
              "id": 61,
              "code": "130201",
              "name": "市辖区",
              "areacode": "130200"
            },
            {
              "id": 62,
              "code": "130202",
              "name": "路南区",
              "areacode": "130200"
            },
            {
              "id": 63,
              "code": "130203",
              "name": "路北区",
              "areacode": "130200"
            },
            {
              "id": 64,
              "code": "130204",
              "name": "古冶区",
              "areacode": "130200"
            },
            {
              "id": 65,
              "code": "130205",
              "name": "开平区",
              "areacode": "130200"
            },
            {
              "id": 66,
              "code": "130207",
              "name": "丰南区",
              "areacode": "130200"
            },
            {
              "id": 67,
              "code": "130208",
              "name": "丰润区",
              "areacode": "130200"
            },
            {
              "id": 68,
              "code": "130223",
              "name": "滦　县",
              "areacode": "130200"
            },
            {
              "id": 69,
              "code": "130224",
              "name": "滦南县",
              "areacode": "130200"
            },
            {
              "id": 70,
              "code": "130225",
              "name": "乐亭县",
              "areacode": "130200"
            },
            {
              "id": 71,
              "code": "130227",
              "name": "迁西县",
              "areacode": "130200"
            },
            {
              "id": 72,
              "code": "130229",
              "name": "玉田县",
              "areacode": "130200"
            },
            {
              "id": 73,
              "code": "130230",
              "name": "唐海县",
              "areacode": "130200"
            },
            {
              "id": 74,
              "code": "130281",
              "name": "遵化市",
              "areacode": "130200"
            },
            {
              "id": 75,
              "code": "130283",
              "name": "迁安市",
              "areacode": "130200"
            }
          ]
        },
        {
          "id": 7,
          "code": "130300",
          "name": "秦皇岛市",
          "citycode": "130000",
          "district": [
            {
              "id": 76,
              "code": "130301",
              "name": "市辖区",
              "areacode": "130300"
            },
            {
              "id": 77,
              "code": "130302",
              "name": "海港区",
              "areacode": "130300"
            },
            {
              "id": 78,
              "code": "130303",
              "name": "山海关区",
              "areacode": "130300"
            },
            {
              "id": 79,
              "code": "130304",
              "name": "北戴河区",
              "areacode": "130300"
            },
            {
              "id": 80,
              "code": "130321",
              "name": "青龙满族自治县",
              "areacode": "130300"
            },
            {
              "id": 81,
              "code": "130322",
              "name": "昌黎县",
              "areacode": "130300"
            },
            {
              "id": 82,
              "code": "130323",
              "name": "抚宁县",
              "areacode": "130300"
            },
            {
              "id": 83,
              "code": "130324",
              "name": "卢龙县",
              "areacode": "130300"
            }
          ]
        },
        {
          "id": 8,
          "code": "130400",
          "name": "邯郸市",
          "citycode": "130000",
          "district": [
            {
              "id": 84,
              "code": "130401",
              "name": "市辖区",
              "areacode": "130400"
            },
            {
              "id": 85,
              "code": "130402",
              "name": "邯山区",
              "areacode": "130400"
            },
            {
              "id": 86,
              "code": "130403",
              "name": "丛台区",
              "areacode": "130400"
            },
            {
              "id": 87,
              "code": "130404",
              "name": "复兴区",
              "areacode": "130400"
            },
            {
              "id": 88,
              "code": "130406",
              "name": "峰峰矿区",
              "areacode": "130400"
            },
            {
              "id": 89,
              "code": "130421",
              "name": "邯郸县",
              "areacode": "130400"
            },
            {
              "id": 90,
              "code": "130423",
              "name": "临漳县",
              "areacode": "130400"
            },
            {
              "id": 91,
              "code": "130424",
              "name": "成安县",
              "areacode": "130400"
            },
            {
              "id": 92,
              "code": "130425",
              "name": "大名县",
              "areacode": "130400"
            },
            {
              "id": 93,
              "code": "130426",
              "name": "涉　县",
              "areacode": "130400"
            },
            {
              "id": 94,
              "code": "130427",
              "name": "磁　县",
              "areacode": "130400"
            },
            {
              "id": 95,
              "code": "130428",
              "name": "肥乡县",
              "areacode": "130400"
            },
            {
              "id": 96,
              "code": "130429",
              "name": "永年县",
              "areacode": "130400"
            },
            {
              "id": 97,
              "code": "130430",
              "name": "邱　县",
              "areacode": "130400"
            },
            {
              "id": 98,
              "code": "130431",
              "name": "鸡泽县",
              "areacode": "130400"
            },
            {
              "id": 99,
              "code": "130432",
              "name": "广平县",
              "areacode": "130400"
            },
            {
              "id": 100,
              "code": "130433",
              "name": "馆陶县",
              "areacode": "130400"
            },
            {
              "id": 101,
              "code": "130434",
              "name": "魏　县",
              "areacode": "130400"
            },
            {
              "id": 102,
              "code": "130435",
              "name": "曲周县",
              "areacode": "130400"
            },
            {
              "id": 103,
              "code": "130481",
              "name": "武安市",
              "areacode": "130400"
            }
          ]
        },
        {
          "id": 9,
          "code": "130500",
          "name": "邢台市",
          "citycode": "130000",
          "district": [
            {
              "id": 104,
              "code": "130501",
              "name": "市辖区",
              "areacode": "130500"
            },
            {
              "id": 105,
              "code": "130502",
              "name": "桥东区",
              "areacode": "130500"
            },
            {
              "id": 106,
              "code": "130503",
              "name": "桥西区",
              "areacode": "130500"
            },
            {
              "id": 107,
              "code": "130521",
              "name": "邢台县",
              "areacode": "130500"
            },
            {
              "id": 108,
              "code": "130522",
              "name": "临城县",
              "areacode": "130500"
            },
            {
              "id": 109,
              "code": "130523",
              "name": "内丘县",
              "areacode": "130500"
            },
            {
              "id": 110,
              "code": "130524",
              "name": "柏乡县",
              "areacode": "130500"
            },
            {
              "id": 111,
              "code": "130525",
              "name": "隆尧县",
              "areacode": "130500"
            },
            {
              "id": 112,
              "code": "130526",
              "name": "任　县",
              "areacode": "130500"
            },
            {
              "id": 113,
              "code": "130527",
              "name": "南和县",
              "areacode": "130500"
            },
            {
              "id": 114,
              "code": "130528",
              "name": "宁晋县",
              "areacode": "130500"
            },
            {
              "id": 115,
              "code": "130529",
              "name": "巨鹿县",
              "areacode": "130500"
            },
            {
              "id": 116,
              "code": "130530",
              "name": "新河县",
              "areacode": "130500"
            },
            {
              "id": 117,
              "code": "130531",
              "name": "广宗县",
              "areacode": "130500"
            },
            {
              "id": 118,
              "code": "130532",
              "name": "平乡县",
              "areacode": "130500"
            },
            {
              "id": 119,
              "code": "130533",
              "name": "威　县",
              "areacode": "130500"
            },
            {
              "id": 120,
              "code": "130534",
              "name": "清河县",
              "areacode": "130500"
            },
            {
              "id": 121,
              "code": "130535",
              "name": "临西县",
              "areacode": "130500"
            },
            {
              "id": 122,
              "code": "130581",
              "name": "南宫市",
              "areacode": "130500"
            },
            {
              "id": 123,
              "code": "130582",
              "name": "沙河市",
              "areacode": "130500"
            }
          ]
        },
        {
          "id": 10,
          "code": "130600",
          "name": "保定市",
          "citycode": "130000",
          "district": [
            {
              "id": 124,
              "code": "130601",
              "name": "市辖区",
              "areacode": "130600"
            },
            {
              "id": 125,
              "code": "130602",
              "name": "新市区",
              "areacode": "130600"
            },
            {
              "id": 126,
              "code": "130603",
              "name": "北市区",
              "areacode": "130600"
            },
            {
              "id": 127,
              "code": "130604",
              "name": "南市区",
              "areacode": "130600"
            },
            {
              "id": 128,
              "code": "130621",
              "name": "满城县",
              "areacode": "130600"
            },
            {
              "id": 129,
              "code": "130622",
              "name": "清苑县",
              "areacode": "130600"
            },
            {
              "id": 130,
              "code": "130623",
              "name": "涞水县",
              "areacode": "130600"
            },
            {
              "id": 131,
              "code": "130624",
              "name": "阜平县",
              "areacode": "130600"
            },
            {
              "id": 132,
              "code": "130625",
              "name": "徐水县",
              "areacode": "130600"
            },
            {
              "id": 133,
              "code": "130626",
              "name": "定兴县",
              "areacode": "130600"
            },
            {
              "id": 134,
              "code": "130627",
              "name": "唐　县",
              "areacode": "130600"
            },
            {
              "id": 135,
              "code": "130628",
              "name": "高阳县",
              "areacode": "130600"
            },
            {
              "id": 136,
              "code": "130629",
              "name": "容城县",
              "areacode": "130600"
            },
            {
              "id": 137,
              "code": "130630",
              "name": "涞源县",
              "areacode": "130600"
            },
            {
              "id": 138,
              "code": "130631",
              "name": "望都县",
              "areacode": "130600"
            },
            {
              "id": 139,
              "code": "130632",
              "name": "安新县",
              "areacode": "130600"
            },
            {
              "id": 140,
              "code": "130633",
              "name": "易　县",
              "areacode": "130600"
            },
            {
              "id": 141,
              "code": "130634",
              "name": "曲阳县",
              "areacode": "130600"
            },
            {
              "id": 142,
              "code": "130635",
              "name": "蠡　县",
              "areacode": "130600"
            },
            {
              "id": 143,
              "code": "130636",
              "name": "顺平县",
              "areacode": "130600"
            },
            {
              "id": 144,
              "code": "130637",
              "name": "博野县",
              "areacode": "130600"
            },
            {
              "id": 145,
              "code": "130638",
              "name": "雄　县",
              "areacode": "130600"
            },
            {
              "id": 146,
              "code": "130681",
              "name": "涿州市",
              "areacode": "130600"
            },
            {
              "id": 147,
              "code": "130682",
              "name": "定州市",
              "areacode": "130600"
            },
            {
              "id": 148,
              "code": "130683",
              "name": "安国市",
              "areacode": "130600"
            },
            {
              "id": 149,
              "code": "130684",
              "name": "高碑店市",
              "areacode": "130600"
            }
          ]
        },
        {
          "id": 11,
          "code": "130700",
          "name": "张家口市",
          "citycode": "130000",
          "district": [
            {
              "id": 150,
              "code": "130701",
              "name": "市辖区",
              "areacode": "130700"
            },
            {
              "id": 151,
              "code": "130702",
              "name": "桥东区",
              "areacode": "130700"
            },
            {
              "id": 152,
              "code": "130703",
              "name": "桥西区",
              "areacode": "130700"
            },
            {
              "id": 153,
              "code": "130705",
              "name": "宣化区",
              "areacode": "130700"
            },
            {
              "id": 154,
              "code": "130706",
              "name": "下花园区",
              "areacode": "130700"
            },
            {
              "id": 155,
              "code": "130721",
              "name": "宣化县",
              "areacode": "130700"
            },
            {
              "id": 156,
              "code": "130722",
              "name": "张北县",
              "areacode": "130700"
            },
            {
              "id": 157,
              "code": "130723",
              "name": "康保县",
              "areacode": "130700"
            },
            {
              "id": 158,
              "code": "130724",
              "name": "沽源县",
              "areacode": "130700"
            },
            {
              "id": 159,
              "code": "130725",
              "name": "尚义县",
              "areacode": "130700"
            },
            {
              "id": 160,
              "code": "130726",
              "name": "蔚　县",
              "areacode": "130700"
            },
            {
              "id": 161,
              "code": "130727",
              "name": "阳原县",
              "areacode": "130700"
            },
            {
              "id": 162,
              "code": "130728",
              "name": "怀安县",
              "areacode": "130700"
            },
            {
              "id": 163,
              "code": "130729",
              "name": "万全县",
              "areacode": "130700"
            },
            {
              "id": 164,
              "code": "130730",
              "name": "怀来县",
              "areacode": "130700"
            },
            {
              "id": 165,
              "code": "130731",
              "name": "涿鹿县",
              "areacode": "130700"
            },
            {
              "id": 166,
              "code": "130732",
              "name": "赤城县",
              "areacode": "130700"
            },
            {
              "id": 167,
              "code": "130733",
              "name": "崇礼县",
              "areacode": "130700"
            }
          ]
        },
        {
          "id": 12,
          "code": "130800",
          "name": "承德市",
          "citycode": "130000",
          "district": [
            {
              "id": 168,
              "code": "130801",
              "name": "市辖区",
              "areacode": "130800"
            },
            {
              "id": 169,
              "code": "130802",
              "name": "双桥区",
              "areacode": "130800"
            },
            {
              "id": 170,
              "code": "130803",
              "name": "双滦区",
              "areacode": "130800"
            },
            {
              "id": 171,
              "code": "130804",
              "name": "鹰手营子矿区",
              "areacode": "130800"
            },
            {
              "id": 172,
              "code": "130821",
              "name": "承德县",
              "areacode": "130800"
            },
            {
              "id": 173,
              "code": "130822",
              "name": "兴隆县",
              "areacode": "130800"
            },
            {
              "id": 174,
              "code": "130823",
              "name": "平泉县",
              "areacode": "130800"
            },
            {
              "id": 175,
              "code": "130824",
              "name": "滦平县",
              "areacode": "130800"
            },
            {
              "id": 176,
              "code": "130825",
              "name": "隆化县",
              "areacode": "130800"
            },
            {
              "id": 177,
              "code": "130826",
              "name": "丰宁满族自治县",
              "areacode": "130800"
            },
            {
              "id": 178,
              "code": "130827",
              "name": "宽城满族自治县",
              "areacode": "130800"
            },
            {
              "id": 179,
              "code": "130828",
              "name": "围场满族蒙古族自治县",
              "areacode": "130800"
            }
          ]
        },
        {
          "id": 13,
          "code": "130900",
          "name": "沧州市",
          "citycode": "130000",
          "district": [
            {
              "id": 180,
              "code": "130901",
              "name": "市辖区",
              "areacode": "130900"
            },
            {
              "id": 181,
              "code": "130902",
              "name": "新华区",
              "areacode": "130900"
            },
            {
              "id": 182,
              "code": "130903",
              "name": "运河区",
              "areacode": "130900"
            },
            {
              "id": 183,
              "code": "130921",
              "name": "沧　县",
              "areacode": "130900"
            },
            {
              "id": 184,
              "code": "130922",
              "name": "青　县",
              "areacode": "130900"
            },
            {
              "id": 185,
              "code": "130923",
              "name": "东光县",
              "areacode": "130900"
            },
            {
              "id": 186,
              "code": "130924",
              "name": "海兴县",
              "areacode": "130900"
            },
            {
              "id": 187,
              "code": "130925",
              "name": "盐山县",
              "areacode": "130900"
            },
            {
              "id": 188,
              "code": "130926",
              "name": "肃宁县",
              "areacode": "130900"
            },
            {
              "id": 189,
              "code": "130927",
              "name": "南皮县",
              "areacode": "130900"
            },
            {
              "id": 190,
              "code": "130928",
              "name": "吴桥县",
              "areacode": "130900"
            },
            {
              "id": 191,
              "code": "130929",
              "name": "献　县",
              "areacode": "130900"
            },
            {
              "id": 192,
              "code": "130930",
              "name": "孟村回族自治县",
              "areacode": "130900"
            },
            {
              "id": 193,
              "code": "130981",
              "name": "泊头市",
              "areacode": "130900"
            },
            {
              "id": 194,
              "code": "130982",
              "name": "任丘市",
              "areacode": "130900"
            },
            {
              "id": 195,
              "code": "130983",
              "name": "黄骅市",
              "areacode": "130900"
            },
            {
              "id": 196,
              "code": "130984",
              "name": "河间市",
              "areacode": "130900"
            }
          ]
        },
        {
          "id": 14,
          "code": "131000",
          "name": "廊坊市",
          "citycode": "130000",
          "district": [
            {
              "id": 197,
              "code": "131001",
              "name": "市辖区",
              "areacode": "131000"
            },
            {
              "id": 198,
              "code": "131002",
              "name": "安次区",
              "areacode": "131000"
            },
            {
              "id": 199,
              "code": "131003",
              "name": "广阳区",
              "areacode": "131000"
            },
            {
              "id": 200,
              "code": "131022",
              "name": "固安县",
              "areacode": "131000"
            },
            {
              "id": 201,
              "code": "131023",
              "name": "永清县",
              "areacode": "131000"
            },
            {
              "id": 202,
              "code": "131024",
              "name": "香河县",
              "areacode": "131000"
            },
            {
              "id": 203,
              "code": "131025",
              "name": "大城县",
              "areacode": "131000"
            },
            {
              "id": 204,
              "code": "131026",
              "name": "文安县",
              "areacode": "131000"
            },
            {
              "id": 205,
              "code": "131028",
              "name": "大厂回族自治县",
              "areacode": "131000"
            },
            {
              "id": 206,
              "code": "131081",
              "name": "霸州市",
              "areacode": "131000"
            },
            {
              "id": 207,
              "code": "131082",
              "name": "三河市",
              "areacode": "131000"
            }
          ]
        },
        {
          "id": 15,
          "code": "131100",
          "name": "衡水市",
          "citycode": "130000",
          "district": [
            {
              "id": 208,
              "code": "131101",
              "name": "市辖区",
              "areacode": "131100"
            },
            {
              "id": 209,
              "code": "131102",
              "name": "桃城区",
              "areacode": "131100"
            },
            {
              "id": 210,
              "code": "131121",
              "name": "枣强县",
              "areacode": "131100"
            },
            {
              "id": 211,
              "code": "131122",
              "name": "武邑县",
              "areacode": "131100"
            },
            {
              "id": 212,
              "code": "131123",
              "name": "武强县",
              "areacode": "131100"
            },
            {
              "id": 213,
              "code": "131124",
              "name": "饶阳县",
              "areacode": "131100"
            },
            {
              "id": 214,
              "code": "131125",
              "name": "安平县",
              "areacode": "131100"
            },
            {
              "id": 215,
              "code": "131126",
              "name": "故城县",
              "areacode": "131100"
            },
            {
              "id": 216,
              "code": "131127",
              "name": "景　县",
              "areacode": "131100"
            },
            {
              "id": 217,
              "code": "131128",
              "name": "阜城县",
              "areacode": "131100"
            },
            {
              "id": 218,
              "code": "131181",
              "name": "冀州市",
              "areacode": "131100"
            },
            {
              "id": 219,
              "code": "131182",
              "name": "深州市",
              "areacode": "131100"
            }
          ]
        }
      ]
    },
    {
      "id": 4,
      "code": "140000",
      "name": "山西省",
      "city": [
        {
          "id": 16,
          "code": "140100",
          "name": "太原市",
          "citycode": "140000",
          "district": [
            {
              "id": 220,
              "code": "140101",
              "name": "市辖区",
              "areacode": "140100"
            },
            {
              "id": 221,
              "code": "140105",
              "name": "小店区",
              "areacode": "140100"
            },
            {
              "id": 222,
              "code": "140106",
              "name": "迎泽区",
              "areacode": "140100"
            },
            {
              "id": 223,
              "code": "140107",
              "name": "杏花岭区",
              "areacode": "140100"
            },
            {
              "id": 224,
              "code": "140108",
              "name": "尖草坪区",
              "areacode": "140100"
            },
            {
              "id": 225,
              "code": "140109",
              "name": "万柏林区",
              "areacode": "140100"
            },
            {
              "id": 226,
              "code": "140110",
              "name": "晋源区",
              "areacode": "140100"
            },
            {
              "id": 227,
              "code": "140121",
              "name": "清徐县",
              "areacode": "140100"
            },
            {
              "id": 228,
              "code": "140122",
              "name": "阳曲县",
              "areacode": "140100"
            },
            {
              "id": 229,
              "code": "140123",
              "name": "娄烦县",
              "areacode": "140100"
            },
            {
              "id": 230,
              "code": "140181",
              "name": "古交市",
              "areacode": "140100"
            }
          ]
        },
        {
          "id": 17,
          "code": "140200",
          "name": "大同市",
          "citycode": "140000",
          "district": [
            {
              "id": 231,
              "code": "140201",
              "name": "市辖区",
              "areacode": "140200"
            },
            {
              "id": 232,
              "code": "140202",
              "name": "城　区",
              "areacode": "140200"
            },
            {
              "id": 233,
              "code": "140203",
              "name": "矿　区",
              "areacode": "140200"
            },
            {
              "id": 234,
              "code": "140211",
              "name": "南郊区",
              "areacode": "140200"
            },
            {
              "id": 235,
              "code": "140212",
              "name": "新荣区",
              "areacode": "140200"
            },
            {
              "id": 236,
              "code": "140221",
              "name": "阳高县",
              "areacode": "140200"
            },
            {
              "id": 237,
              "code": "140222",
              "name": "天镇县",
              "areacode": "140200"
            },
            {
              "id": 238,
              "code": "140223",
              "name": "广灵县",
              "areacode": "140200"
            },
            {
              "id": 239,
              "code": "140224",
              "name": "灵丘县",
              "areacode": "140200"
            },
            {
              "id": 240,
              "code": "140225",
              "name": "浑源县",
              "areacode": "140200"
            },
            {
              "id": 241,
              "code": "140226",
              "name": "左云县",
              "areacode": "140200"
            },
            {
              "id": 242,
              "code": "140227",
              "name": "大同县",
              "areacode": "140200"
            }
          ]
        },
        {
          "id": 18,
          "code": "140300",
          "name": "阳泉市",
          "citycode": "140000",
          "district": [
            {
              "id": 243,
              "code": "140301",
              "name": "市辖区",
              "areacode": "140300"
            },
            {
              "id": 244,
              "code": "140302",
              "name": "城　区",
              "areacode": "140300"
            },
            {
              "id": 245,
              "code": "140303",
              "name": "矿　区",
              "areacode": "140300"
            },
            {
              "id": 246,
              "code": "140311",
              "name": "郊　区",
              "areacode": "140300"
            },
            {
              "id": 247,
              "code": "140321",
              "name": "平定县",
              "areacode": "140300"
            },
            {
              "id": 248,
              "code": "140322",
              "name": "盂　县",
              "areacode": "140300"
            }
          ]
        },
        {
          "id": 19,
          "code": "140400",
          "name": "长治市",
          "citycode": "140000",
          "district": [
            {
              "id": 249,
              "code": "140401",
              "name": "市辖区",
              "areacode": "140400"
            },
            {
              "id": 250,
              "code": "140402",
              "name": "城　区",
              "areacode": "140400"
            },
            {
              "id": 251,
              "code": "140411",
              "name": "郊　区",
              "areacode": "140400"
            },
            {
              "id": 252,
              "code": "140421",
              "name": "长治县",
              "areacode": "140400"
            },
            {
              "id": 253,
              "code": "140423",
              "name": "襄垣县",
              "areacode": "140400"
            },
            {
              "id": 254,
              "code": "140424",
              "name": "屯留县",
              "areacode": "140400"
            },
            {
              "id": 255,
              "code": "140425",
              "name": "平顺县",
              "areacode": "140400"
            },
            {
              "id": 256,
              "code": "140426",
              "name": "黎城县",
              "areacode": "140400"
            },
            {
              "id": 257,
              "code": "140427",
              "name": "壶关县",
              "areacode": "140400"
            },
            {
              "id": 258,
              "code": "140428",
              "name": "长子县",
              "areacode": "140400"
            },
            {
              "id": 259,
              "code": "140429",
              "name": "武乡县",
              "areacode": "140400"
            },
            {
              "id": 260,
              "code": "140430",
              "name": "沁　县",
              "areacode": "140400"
            },
            {
              "id": 261,
              "code": "140431",
              "name": "沁源县",
              "areacode": "140400"
            },
            {
              "id": 262,
              "code": "140481",
              "name": "潞城市",
              "areacode": "140400"
            }
          ]
        },
        {
          "id": 20,
          "code": "140500",
          "name": "晋城市",
          "citycode": "140000",
          "district": [
            {
              "id": 263,
              "code": "140501",
              "name": "市辖区",
              "areacode": "140500"
            },
            {
              "id": 264,
              "code": "140502",
              "name": "城　区",
              "areacode": "140500"
            },
            {
              "id": 265,
              "code": "140521",
              "name": "沁水县",
              "areacode": "140500"
            },
            {
              "id": 266,
              "code": "140522",
              "name": "阳城县",
              "areacode": "140500"
            },
            {
              "id": 267,
              "code": "140524",
              "name": "陵川县",
              "areacode": "140500"
            },
            {
              "id": 268,
              "code": "140525",
              "name": "泽州县",
              "areacode": "140500"
            },
            {
              "id": 269,
              "code": "140581",
              "name": "高平市",
              "areacode": "140500"
            }
          ]
        },
        {
          "id": 21,
          "code": "140600",
          "name": "朔州市",
          "citycode": "140000",
          "district": [
            {
              "id": 270,
              "code": "140601",
              "name": "市辖区",
              "areacode": "140600"
            },
            {
              "id": 271,
              "code": "140602",
              "name": "朔城区",
              "areacode": "140600"
            },
            {
              "id": 272,
              "code": "140603",
              "name": "平鲁区",
              "areacode": "140600"
            },
            {
              "id": 273,
              "code": "140621",
              "name": "山阴县",
              "areacode": "140600"
            },
            {
              "id": 274,
              "code": "140622",
              "name": "应　县",
              "areacode": "140600"
            },
            {
              "id": 275,
              "code": "140623",
              "name": "右玉县",
              "areacode": "140600"
            },
            {
              "id": 276,
              "code": "140624",
              "name": "怀仁县",
              "areacode": "140600"
            }
          ]
        },
        {
          "id": 22,
          "code": "140700",
          "name": "晋中市",
          "citycode": "140000",
          "district": [
            {
              "id": 277,
              "code": "140701",
              "name": "市辖区",
              "areacode": "140700"
            },
            {
              "id": 278,
              "code": "140702",
              "name": "榆次区",
              "areacode": "140700"
            },
            {
              "id": 279,
              "code": "140721",
              "name": "榆社县",
              "areacode": "140700"
            },
            {
              "id": 280,
              "code": "140722",
              "name": "左权县",
              "areacode": "140700"
            },
            {
              "id": 281,
              "code": "140723",
              "name": "和顺县",
              "areacode": "140700"
            },
            {
              "id": 282,
              "code": "140724",
              "name": "昔阳县",
              "areacode": "140700"
            },
            {
              "id": 283,
              "code": "140725",
              "name": "寿阳县",
              "areacode": "140700"
            },
            {
              "id": 284,
              "code": "140726",
              "name": "太谷县",
              "areacode": "140700"
            },
            {
              "id": 285,
              "code": "140727",
              "name": "祁　县",
              "areacode": "140700"
            },
            {
              "id": 286,
              "code": "140728",
              "name": "平遥县",
              "areacode": "140700"
            },
            {
              "id": 287,
              "code": "140729",
              "name": "灵石县",
              "areacode": "140700"
            },
            {
              "id": 288,
              "code": "140781",
              "name": "介休市",
              "areacode": "140700"
            }
          ]
        },
        {
          "id": 23,
          "code": "140800",
          "name": "运城市",
          "citycode": "140000",
          "district": [
            {
              "id": 289,
              "code": "140801",
              "name": "市辖区",
              "areacode": "140800"
            },
            {
              "id": 290,
              "code": "140802",
              "name": "盐湖区",
              "areacode": "140800"
            },
            {
              "id": 291,
              "code": "140821",
              "name": "临猗县",
              "areacode": "140800"
            },
            {
              "id": 292,
              "code": "140822",
              "name": "万荣县",
              "areacode": "140800"
            },
            {
              "id": 293,
              "code": "140823",
              "name": "闻喜县",
              "areacode": "140800"
            },
            {
              "id": 294,
              "code": "140824",
              "name": "稷山县",
              "areacode": "140800"
            },
            {
              "id": 295,
              "code": "140825",
              "name": "新绛县",
              "areacode": "140800"
            },
            {
              "id": 296,
              "code": "140826",
              "name": "绛　县",
              "areacode": "140800"
            },
            {
              "id": 297,
              "code": "140827",
              "name": "垣曲县",
              "areacode": "140800"
            },
            {
              "id": 298,
              "code": "140828",
              "name": "夏　县",
              "areacode": "140800"
            },
            {
              "id": 299,
              "code": "140829",
              "name": "平陆县",
              "areacode": "140800"
            },
            {
              "id": 300,
              "code": "140830",
              "name": "芮城县",
              "areacode": "140800"
            },
            {
              "id": 301,
              "code": "140881",
              "name": "永济市",
              "areacode": "140800"
            },
            {
              "id": 302,
              "code": "140882",
              "name": "河津市",
              "areacode": "140800"
            }
          ]
        },
        {
          "id": 24,
          "code": "140900",
          "name": "忻州市",
          "citycode": "140000",
          "district": [
            {
              "id": 303,
              "code": "140901",
              "name": "市辖区",
              "areacode": "140900"
            },
            {
              "id": 304,
              "code": "140902",
              "name": "忻府区",
              "areacode": "140900"
            },
            {
              "id": 305,
              "code": "140921",
              "name": "定襄县",
              "areacode": "140900"
            },
            {
              "id": 306,
              "code": "140922",
              "name": "五台县",
              "areacode": "140900"
            },
            {
              "id": 307,
              "code": "140923",
              "name": "代　县",
              "areacode": "140900"
            },
            {
              "id": 308,
              "code": "140924",
              "name": "繁峙县",
              "areacode": "140900"
            },
            {
              "id": 309,
              "code": "140925",
              "name": "宁武县",
              "areacode": "140900"
            },
            {
              "id": 310,
              "code": "140926",
              "name": "静乐县",
              "areacode": "140900"
            },
            {
              "id": 311,
              "code": "140927",
              "name": "神池县",
              "areacode": "140900"
            },
            {
              "id": 312,
              "code": "140928",
              "name": "五寨县",
              "areacode": "140900"
            },
            {
              "id": 313,
              "code": "140929",
              "name": "岢岚县",
              "areacode": "140900"
            },
            {
              "id": 314,
              "code": "140930",
              "name": "河曲县",
              "areacode": "140900"
            },
            {
              "id": 315,
              "code": "140931",
              "name": "保德县",
              "areacode": "140900"
            },
            {
              "id": 316,
              "code": "140932",
              "name": "偏关县",
              "areacode": "140900"
            },
            {
              "id": 317,
              "code": "140981",
              "name": "原平市",
              "areacode": "140900"
            }
          ]
        },
        {
          "id": 25,
          "code": "141000",
          "name": "临汾市",
          "citycode": "140000",
          "district": [
            {
              "id": 318,
              "code": "141001",
              "name": "市辖区",
              "areacode": "141000"
            },
            {
              "id": 319,
              "code": "141002",
              "name": "尧都区",
              "areacode": "141000"
            },
            {
              "id": 320,
              "code": "141021",
              "name": "曲沃县",
              "areacode": "141000"
            },
            {
              "id": 321,
              "code": "141022",
              "name": "翼城县",
              "areacode": "141000"
            },
            {
              "id": 322,
              "code": "141023",
              "name": "襄汾县",
              "areacode": "141000"
            },
            {
              "id": 323,
              "code": "141024",
              "name": "洪洞县",
              "areacode": "141000"
            },
            {
              "id": 324,
              "code": "141025",
              "name": "古　县",
              "areacode": "141000"
            },
            {
              "id": 325,
              "code": "141026",
              "name": "安泽县",
              "areacode": "141000"
            },
            {
              "id": 326,
              "code": "141027",
              "name": "浮山县",
              "areacode": "141000"
            },
            {
              "id": 327,
              "code": "141028",
              "name": "吉　县",
              "areacode": "141000"
            },
            {
              "id": 328,
              "code": "141029",
              "name": "乡宁县",
              "areacode": "141000"
            },
            {
              "id": 329,
              "code": "141030",
              "name": "大宁县",
              "areacode": "141000"
            },
            {
              "id": 330,
              "code": "141031",
              "name": "隰　县",
              "areacode": "141000"
            },
            {
              "id": 331,
              "code": "141032",
              "name": "永和县",
              "areacode": "141000"
            },
            {
              "id": 332,
              "code": "141033",
              "name": "蒲　县",
              "areacode": "141000"
            },
            {
              "id": 333,
              "code": "141034",
              "name": "汾西县",
              "areacode": "141000"
            },
            {
              "id": 334,
              "code": "141081",
              "name": "侯马市",
              "areacode": "141000"
            },
            {
              "id": 335,
              "code": "141082",
              "name": "霍州市",
              "areacode": "141000"
            }
          ]
        },
        {
          "id": 26,
          "code": "141100",
          "name": "吕梁市",
          "citycode": "140000",
          "district": [
            {
              "id": 336,
              "code": "141101",
              "name": "市辖区",
              "areacode": "141100"
            },
            {
              "id": 337,
              "code": "141102",
              "name": "离石区",
              "areacode": "141100"
            },
            {
              "id": 338,
              "code": "141121",
              "name": "文水县",
              "areacode": "141100"
            },
            {
              "id": 339,
              "code": "141122",
              "name": "交城县",
              "areacode": "141100"
            },
            {
              "id": 340,
              "code": "141123",
              "name": "兴　县",
              "areacode": "141100"
            },
            {
              "id": 341,
              "code": "141124",
              "name": "临　县",
              "areacode": "141100"
            },
            {
              "id": 342,
              "code": "141125",
              "name": "柳林县",
              "areacode": "141100"
            },
            {
              "id": 343,
              "code": "141126",
              "name": "石楼县",
              "areacode": "141100"
            },
            {
              "id": 344,
              "code": "141127",
              "name": "岚　县",
              "areacode": "141100"
            },
            {
              "id": 345,
              "code": "141128",
              "name": "方山县",
              "areacode": "141100"
            },
            {
              "id": 346,
              "code": "141129",
              "name": "中阳县",
              "areacode": "141100"
            },
            {
              "id": 347,
              "code": "141130",
              "name": "交口县",
              "areacode": "141100"
            },
            {
              "id": 348,
              "code": "141181",
              "name": "孝义市",
              "areacode": "141100"
            },
            {
              "id": 349,
              "code": "141182",
              "name": "汾阳市",
              "areacode": "141100"
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "code": "150000",
      "name": "内蒙古自治区",
      "city": [
        {
          "id": 27,
          "code": "150100",
          "name": "呼和浩特市",
          "citycode": "150000",
          "district": [
            {
              "id": 350,
              "code": "150101",
              "name": "市辖区",
              "areacode": "150100"
            },
            {
              "id": 351,
              "code": "150102",
              "name": "新城区",
              "areacode": "150100"
            },
            {
              "id": 352,
              "code": "150103",
              "name": "回民区",
              "areacode": "150100"
            },
            {
              "id": 353,
              "code": "150104",
              "name": "玉泉区",
              "areacode": "150100"
            },
            {
              "id": 354,
              "code": "150105",
              "name": "赛罕区",
              "areacode": "150100"
            },
            {
              "id": 355,
              "code": "150121",
              "name": "土默特左旗",
              "areacode": "150100"
            },
            {
              "id": 356,
              "code": "150122",
              "name": "托克托县",
              "areacode": "150100"
            },
            {
              "id": 357,
              "code": "150123",
              "name": "和林格尔县",
              "areacode": "150100"
            },
            {
              "id": 358,
              "code": "150124",
              "name": "清水河县",
              "areacode": "150100"
            },
            {
              "id": 359,
              "code": "150125",
              "name": "武川县",
              "areacode": "150100"
            }
          ]
        },
        {
          "id": 28,
          "code": "150200",
          "name": "包头市",
          "citycode": "150000",
          "district": [
            {
              "id": 360,
              "code": "150201",
              "name": "市辖区",
              "areacode": "150200"
            },
            {
              "id": 361,
              "code": "150202",
              "name": "东河区",
              "areacode": "150200"
            },
            {
              "id": 362,
              "code": "150203",
              "name": "昆都仑区",
              "areacode": "150200"
            },
            {
              "id": 363,
              "code": "150204",
              "name": "青山区",
              "areacode": "150200"
            },
            {
              "id": 364,
              "code": "150205",
              "name": "石拐区",
              "areacode": "150200"
            },
            {
              "id": 365,
              "code": "150206",
              "name": "白云矿区",
              "areacode": "150200"
            },
            {
              "id": 366,
              "code": "150207",
              "name": "九原区",
              "areacode": "150200"
            },
            {
              "id": 367,
              "code": "150221",
              "name": "土默特右旗",
              "areacode": "150200"
            },
            {
              "id": 368,
              "code": "150222",
              "name": "固阳县",
              "areacode": "150200"
            },
            {
              "id": 369,
              "code": "150223",
              "name": "达尔罕茂明安联合旗",
              "areacode": "150200"
            }
          ]
        },
        {
          "id": 29,
          "code": "150300",
          "name": "乌海市",
          "citycode": "150000",
          "district": [
            {
              "id": 370,
              "code": "150301",
              "name": "市辖区",
              "areacode": "150300"
            },
            {
              "id": 371,
              "code": "150302",
              "name": "海勃湾区",
              "areacode": "150300"
            },
            {
              "id": 372,
              "code": "150303",
              "name": "海南区",
              "areacode": "150300"
            },
            {
              "id": 373,
              "code": "150304",
              "name": "乌达区",
              "areacode": "150300"
            }
          ]
        },
        {
          "id": 30,
          "code": "150400",
          "name": "赤峰市",
          "citycode": "150000",
          "district": [
            {
              "id": 374,
              "code": "150401",
              "name": "市辖区",
              "areacode": "150400"
            },
            {
              "id": 375,
              "code": "150402",
              "name": "红山区",
              "areacode": "150400"
            },
            {
              "id": 376,
              "code": "150403",
              "name": "元宝山区",
              "areacode": "150400"
            },
            {
              "id": 377,
              "code": "150404",
              "name": "松山区",
              "areacode": "150400"
            },
            {
              "id": 378,
              "code": "150421",
              "name": "阿鲁科尔沁旗",
              "areacode": "150400"
            },
            {
              "id": 379,
              "code": "150422",
              "name": "巴林左旗",
              "areacode": "150400"
            },
            {
              "id": 380,
              "code": "150423",
              "name": "巴林右旗",
              "areacode": "150400"
            },
            {
              "id": 381,
              "code": "150424",
              "name": "林西县",
              "areacode": "150400"
            },
            {
              "id": 382,
              "code": "150425",
              "name": "克什克腾旗",
              "areacode": "150400"
            },
            {
              "id": 383,
              "code": "150426",
              "name": "翁牛特旗",
              "areacode": "150400"
            },
            {
              "id": 384,
              "code": "150428",
              "name": "喀喇沁旗",
              "areacode": "150400"
            },
            {
              "id": 385,
              "code": "150429",
              "name": "宁城县",
              "areacode": "150400"
            },
            {
              "id": 386,
              "code": "150430",
              "name": "敖汉旗",
              "areacode": "150400"
            }
          ]
        },
        {
          "id": 31,
          "code": "150500",
          "name": "通辽市",
          "citycode": "150000",
          "district": [
            {
              "id": 387,
              "code": "150501",
              "name": "市辖区",
              "areacode": "150500"
            },
            {
              "id": 388,
              "code": "150502",
              "name": "科尔沁区",
              "areacode": "150500"
            },
            {
              "id": 389,
              "code": "150521",
              "name": "科尔沁左翼中旗",
              "areacode": "150500"
            },
            {
              "id": 390,
              "code": "150522",
              "name": "科尔沁左翼后旗",
              "areacode": "150500"
            },
            {
              "id": 391,
              "code": "150523",
              "name": "开鲁县",
              "areacode": "150500"
            },
            {
              "id": 392,
              "code": "150524",
              "name": "库伦旗",
              "areacode": "150500"
            },
            {
              "id": 393,
              "code": "150525",
              "name": "奈曼旗",
              "areacode": "150500"
            },
            {
              "id": 394,
              "code": "150526",
              "name": "扎鲁特旗",
              "areacode": "150500"
            },
            {
              "id": 395,
              "code": "150581",
              "name": "霍林郭勒市",
              "areacode": "150500"
            }
          ]
        },
        {
          "id": 32,
          "code": "150600",
          "name": "鄂尔多斯市",
          "citycode": "150000",
          "district": [
            {
              "id": 396,
              "code": "150602",
              "name": "东胜区",
              "areacode": "150600"
            },
            {
              "id": 397,
              "code": "150621",
              "name": "达拉特旗",
              "areacode": "150600"
            },
            {
              "id": 398,
              "code": "150622",
              "name": "准格尔旗",
              "areacode": "150600"
            },
            {
              "id": 399,
              "code": "150623",
              "name": "鄂托克前旗",
              "areacode": "150600"
            },
            {
              "id": 400,
              "code": "150624",
              "name": "鄂托克旗",
              "areacode": "150600"
            },
            {
              "id": 401,
              "code": "150625",
              "name": "杭锦旗",
              "areacode": "150600"
            },
            {
              "id": 402,
              "code": "150626",
              "name": "乌审旗",
              "areacode": "150600"
            },
            {
              "id": 403,
              "code": "150627",
              "name": "伊金霍洛旗",
              "areacode": "150600"
            }
          ]
        },
        {
          "id": 33,
          "code": "150700",
          "name": "呼伦贝尔市",
          "citycode": "150000",
          "district": [
            {
              "id": 404,
              "code": "150701",
              "name": "市辖区",
              "areacode": "150700"
            },
            {
              "id": 405,
              "code": "150702",
              "name": "海拉尔区",
              "areacode": "150700"
            },
            {
              "id": 406,
              "code": "150721",
              "name": "阿荣旗",
              "areacode": "150700"
            },
            {
              "id": 407,
              "code": "150722",
              "name": "莫力达瓦达斡尔族自治旗",
              "areacode": "150700"
            },
            {
              "id": 408,
              "code": "150723",
              "name": "鄂伦春自治旗",
              "areacode": "150700"
            },
            {
              "id": 409,
              "code": "150724",
              "name": "鄂温克族自治旗",
              "areacode": "150700"
            },
            {
              "id": 410,
              "code": "150725",
              "name": "陈巴尔虎旗",
              "areacode": "150700"
            },
            {
              "id": 411,
              "code": "150726",
              "name": "新巴尔虎左旗",
              "areacode": "150700"
            },
            {
              "id": 412,
              "code": "150727",
              "name": "新巴尔虎右旗",
              "areacode": "150700"
            },
            {
              "id": 413,
              "code": "150781",
              "name": "满洲里市",
              "areacode": "150700"
            },
            {
              "id": 414,
              "code": "150782",
              "name": "牙克石市",
              "areacode": "150700"
            },
            {
              "id": 415,
              "code": "150783",
              "name": "扎兰屯市",
              "areacode": "150700"
            },
            {
              "id": 416,
              "code": "150784",
              "name": "额尔古纳市",
              "areacode": "150700"
            },
            {
              "id": 417,
              "code": "150785",
              "name": "根河市",
              "areacode": "150700"
            }
          ]
        },
        {
          "id": 34,
          "code": "150800",
          "name": "巴彦淖尔市",
          "citycode": "150000",
          "district": [
            {
              "id": 418,
              "code": "150801",
              "name": "市辖区",
              "areacode": "150800"
            },
            {
              "id": 419,
              "code": "150802",
              "name": "临河区",
              "areacode": "150800"
            },
            {
              "id": 420,
              "code": "150821",
              "name": "五原县",
              "areacode": "150800"
            },
            {
              "id": 421,
              "code": "150822",
              "name": "磴口县",
              "areacode": "150800"
            },
            {
              "id": 422,
              "code": "150823",
              "name": "乌拉特前旗",
              "areacode": "150800"
            },
            {
              "id": 423,
              "code": "150824",
              "name": "乌拉特中旗",
              "areacode": "150800"
            },
            {
              "id": 424,
              "code": "150825",
              "name": "乌拉特后旗",
              "areacode": "150800"
            },
            {
              "id": 425,
              "code": "150826",
              "name": "杭锦后旗",
              "areacode": "150800"
            }
          ]
        },
        {
          "id": 35,
          "code": "150900",
          "name": "乌兰察布市",
          "citycode": "150000",
          "district": [
            {
              "id": 426,
              "code": "150901",
              "name": "市辖区",
              "areacode": "150900"
            },
            {
              "id": 427,
              "code": "150902",
              "name": "集宁区",
              "areacode": "150900"
            },
            {
              "id": 428,
              "code": "150921",
              "name": "卓资县",
              "areacode": "150900"
            },
            {
              "id": 429,
              "code": "150922",
              "name": "化德县",
              "areacode": "150900"
            },
            {
              "id": 430,
              "code": "150923",
              "name": "商都县",
              "areacode": "150900"
            },
            {
              "id": 431,
              "code": "150924",
              "name": "兴和县",
              "areacode": "150900"
            },
            {
              "id": 432,
              "code": "150925",
              "name": "凉城县",
              "areacode": "150900"
            },
            {
              "id": 433,
              "code": "150926",
              "name": "察哈尔右翼前旗",
              "areacode": "150900"
            },
            {
              "id": 434,
              "code": "150927",
              "name": "察哈尔右翼中旗",
              "areacode": "150900"
            },
            {
              "id": 435,
              "code": "150928",
              "name": "察哈尔右翼后旗",
              "areacode": "150900"
            },
            {
              "id": 436,
              "code": "150929",
              "name": "四子王旗",
              "areacode": "150900"
            },
            {
              "id": 437,
              "code": "150981",
              "name": "丰镇市",
              "areacode": "150900"
            }
          ]
        },
        {
          "id": 36,
          "code": "152200",
          "name": "兴安盟",
          "citycode": "150000",
          "district": [
            {
              "id": 438,
              "code": "152201",
              "name": "乌兰浩特市",
              "areacode": "152200"
            },
            {
              "id": 439,
              "code": "152202",
              "name": "阿尔山市",
              "areacode": "152200"
            },
            {
              "id": 440,
              "code": "152221",
              "name": "科尔沁右翼前旗",
              "areacode": "152200"
            },
            {
              "id": 441,
              "code": "152222",
              "name": "科尔沁右翼中旗",
              "areacode": "152200"
            },
            {
              "id": 442,
              "code": "152223",
              "name": "扎赉特旗",
              "areacode": "152200"
            },
            {
              "id": 443,
              "code": "152224",
              "name": "突泉县",
              "areacode": "152200"
            }
          ]
        },
        {
          "id": 37,
          "code": "152500",
          "name": "锡林郭勒盟",
          "citycode": "150000",
          "district": [
            {
              "id": 444,
              "code": "152501",
              "name": "二连浩特市",
              "areacode": "152500"
            },
            {
              "id": 445,
              "code": "152502",
              "name": "锡林浩特市",
              "areacode": "152500"
            },
            {
              "id": 446,
              "code": "152522",
              "name": "阿巴嘎旗",
              "areacode": "152500"
            },
            {
              "id": 447,
              "code": "152523",
              "name": "苏尼特左旗",
              "areacode": "152500"
            },
            {
              "id": 448,
              "code": "152524",
              "name": "苏尼特右旗",
              "areacode": "152500"
            },
            {
              "id": 449,
              "code": "152525",
              "name": "东乌珠穆沁旗",
              "areacode": "152500"
            },
            {
              "id": 450,
              "code": "152526",
              "name": "西乌珠穆沁旗",
              "areacode": "152500"
            },
            {
              "id": 451,
              "code": "152527",
              "name": "太仆寺旗",
              "areacode": "152500"
            },
            {
              "id": 452,
              "code": "152528",
              "name": "镶黄旗",
              "areacode": "152500"
            },
            {
              "id": 453,
              "code": "152529",
              "name": "正镶白旗",
              "areacode": "152500"
            },
            {
              "id": 454,
              "code": "152530",
              "name": "正蓝旗",
              "areacode": "152500"
            },
            {
              "id": 455,
              "code": "152531",
              "name": "多伦县",
              "areacode": "152500"
            }
          ]
        },
        {
          "id": 38,
          "code": "152900",
          "name": "阿拉善盟",
          "citycode": "150000",
          "district": [
            {
              "id": 456,
              "code": "152921",
              "name": "阿拉善左旗",
              "areacode": "152900"
            },
            {
              "id": 457,
              "code": "152922",
              "name": "阿拉善右旗",
              "areacode": "152900"
            },
            {
              "id": 458,
              "code": "152923",
              "name": "额济纳旗",
              "areacode": "152900"
            }
          ]
        }
      ]
    },
    {
      "id": 6,
      "code": "210000",
      "name": "辽宁省",
      "city": [
        {
          "id": 39,
          "code": "210100",
          "name": "沈阳市",
          "citycode": "210000",
          "district": [
            {
              "id": 459,
              "code": "210101",
              "name": "市辖区",
              "areacode": "210100"
            },
            {
              "id": 460,
              "code": "210102",
              "name": "和平区",
              "areacode": "210100"
            },
            {
              "id": 461,
              "code": "210103",
              "name": "沈河区",
              "areacode": "210100"
            },
            {
              "id": 462,
              "code": "210104",
              "name": "大东区",
              "areacode": "210100"
            },
            {
              "id": 463,
              "code": "210105",
              "name": "皇姑区",
              "areacode": "210100"
            },
            {
              "id": 464,
              "code": "210106",
              "name": "铁西区",
              "areacode": "210100"
            },
            {
              "id": 465,
              "code": "210111",
              "name": "苏家屯区",
              "areacode": "210100"
            },
            {
              "id": 466,
              "code": "210112",
              "name": "东陵区",
              "areacode": "210100"
            },
            {
              "id": 467,
              "code": "210113",
              "name": "新城子区",
              "areacode": "210100"
            },
            {
              "id": 468,
              "code": "210114",
              "name": "于洪区",
              "areacode": "210100"
            },
            {
              "id": 469,
              "code": "210122",
              "name": "辽中县",
              "areacode": "210100"
            },
            {
              "id": 470,
              "code": "210123",
              "name": "康平县",
              "areacode": "210100"
            },
            {
              "id": 471,
              "code": "210124",
              "name": "法库县",
              "areacode": "210100"
            },
            {
              "id": 472,
              "code": "210181",
              "name": "新民市",
              "areacode": "210100"
            }
          ]
        },
        {
          "id": 40,
          "code": "210200",
          "name": "大连市",
          "citycode": "210000",
          "district": [
            {
              "id": 473,
              "code": "210201",
              "name": "市辖区",
              "areacode": "210200"
            },
            {
              "id": 474,
              "code": "210202",
              "name": "中山区",
              "areacode": "210200"
            },
            {
              "id": 475,
              "code": "210203",
              "name": "西岗区",
              "areacode": "210200"
            },
            {
              "id": 476,
              "code": "210204",
              "name": "沙河口区",
              "areacode": "210200"
            },
            {
              "id": 477,
              "code": "210211",
              "name": "甘井子区",
              "areacode": "210200"
            },
            {
              "id": 478,
              "code": "210212",
              "name": "旅顺口区",
              "areacode": "210200"
            },
            {
              "id": 479,
              "code": "210213",
              "name": "金州区",
              "areacode": "210200"
            },
            {
              "id": 480,
              "code": "210224",
              "name": "长海县",
              "areacode": "210200"
            },
            {
              "id": 481,
              "code": "210281",
              "name": "瓦房店市",
              "areacode": "210200"
            },
            {
              "id": 482,
              "code": "210282",
              "name": "普兰店市",
              "areacode": "210200"
            },
            {
              "id": 483,
              "code": "210283",
              "name": "庄河市",
              "areacode": "210200"
            }
          ]
        },
        {
          "id": 41,
          "code": "210300",
          "name": "鞍山市",
          "citycode": "210000",
          "district": [
            {
              "id": 484,
              "code": "210301",
              "name": "市辖区",
              "areacode": "210300"
            },
            {
              "id": 485,
              "code": "210302",
              "name": "铁东区",
              "areacode": "210300"
            },
            {
              "id": 486,
              "code": "210303",
              "name": "铁西区",
              "areacode": "210300"
            },
            {
              "id": 487,
              "code": "210304",
              "name": "立山区",
              "areacode": "210300"
            },
            {
              "id": 488,
              "code": "210311",
              "name": "千山区",
              "areacode": "210300"
            },
            {
              "id": 489,
              "code": "210321",
              "name": "台安县",
              "areacode": "210300"
            },
            {
              "id": 490,
              "code": "210323",
              "name": "岫岩满族自治县",
              "areacode": "210300"
            },
            {
              "id": 491,
              "code": "210381",
              "name": "海城市",
              "areacode": "210300"
            }
          ]
        },
        {
          "id": 42,
          "code": "210400",
          "name": "抚顺市",
          "citycode": "210000",
          "district": [
            {
              "id": 492,
              "code": "210401",
              "name": "市辖区",
              "areacode": "210400"
            },
            {
              "id": 493,
              "code": "210402",
              "name": "新抚区",
              "areacode": "210400"
            },
            {
              "id": 494,
              "code": "210403",
              "name": "东洲区",
              "areacode": "210400"
            },
            {
              "id": 495,
              "code": "210404",
              "name": "望花区",
              "areacode": "210400"
            },
            {
              "id": 496,
              "code": "210411",
              "name": "顺城区",
              "areacode": "210400"
            },
            {
              "id": 497,
              "code": "210421",
              "name": "抚顺县",
              "areacode": "210400"
            },
            {
              "id": 498,
              "code": "210422",
              "name": "新宾满族自治县",
              "areacode": "210400"
            },
            {
              "id": 499,
              "code": "210423",
              "name": "清原满族自治县",
              "areacode": "210400"
            }
          ]
        },
        {
          "id": 43,
          "code": "210500",
          "name": "本溪市",
          "citycode": "210000",
          "district": [
            {
              "id": 500,
              "code": "210501",
              "name": "市辖区",
              "areacode": "210500"
            },
            {
              "id": 501,
              "code": "210502",
              "name": "平山区",
              "areacode": "210500"
            },
            {
              "id": 502,
              "code": "210503",
              "name": "溪湖区",
              "areacode": "210500"
            },
            {
              "id": 503,
              "code": "210504",
              "name": "明山区",
              "areacode": "210500"
            },
            {
              "id": 504,
              "code": "210505",
              "name": "南芬区",
              "areacode": "210500"
            },
            {
              "id": 505,
              "code": "210521",
              "name": "本溪满族自治县",
              "areacode": "210500"
            },
            {
              "id": 506,
              "code": "210522",
              "name": "桓仁满族自治县",
              "areacode": "210500"
            }
          ]
        },
        {
          "id": 44,
          "code": "210600",
          "name": "丹东市",
          "citycode": "210000",
          "district": [
            {
              "id": 507,
              "code": "210601",
              "name": "市辖区",
              "areacode": "210600"
            },
            {
              "id": 508,
              "code": "210602",
              "name": "元宝区",
              "areacode": "210600"
            },
            {
              "id": 509,
              "code": "210603",
              "name": "振兴区",
              "areacode": "210600"
            },
            {
              "id": 510,
              "code": "210604",
              "name": "振安区",
              "areacode": "210600"
            },
            {
              "id": 511,
              "code": "210624",
              "name": "宽甸满族自治县",
              "areacode": "210600"
            },
            {
              "id": 512,
              "code": "210681",
              "name": "东港市",
              "areacode": "210600"
            },
            {
              "id": 513,
              "code": "210682",
              "name": "凤城市",
              "areacode": "210600"
            }
          ]
        },
        {
          "id": 45,
          "code": "210700",
          "name": "锦州市",
          "citycode": "210000",
          "district": [
            {
              "id": 514,
              "code": "210701",
              "name": "市辖区",
              "areacode": "210700"
            },
            {
              "id": 515,
              "code": "210702",
              "name": "古塔区",
              "areacode": "210700"
            },
            {
              "id": 516,
              "code": "210703",
              "name": "凌河区",
              "areacode": "210700"
            },
            {
              "id": 517,
              "code": "210711",
              "name": "太和区",
              "areacode": "210700"
            },
            {
              "id": 518,
              "code": "210726",
              "name": "黑山县",
              "areacode": "210700"
            },
            {
              "id": 519,
              "code": "210727",
              "name": "义　县",
              "areacode": "210700"
            },
            {
              "id": 520,
              "code": "210781",
              "name": "凌海市",
              "areacode": "210700"
            },
            {
              "id": 521,
              "code": "210782",
              "name": "北宁市",
              "areacode": "210700"
            }
          ]
        },
        {
          "id": 46,
          "code": "210800",
          "name": "营口市",
          "citycode": "210000",
          "district": [
            {
              "id": 522,
              "code": "210801",
              "name": "市辖区",
              "areacode": "210800"
            },
            {
              "id": 523,
              "code": "210802",
              "name": "站前区",
              "areacode": "210800"
            },
            {
              "id": 524,
              "code": "210803",
              "name": "西市区",
              "areacode": "210800"
            },
            {
              "id": 525,
              "code": "210804",
              "name": "鲅鱼圈区",
              "areacode": "210800"
            },
            {
              "id": 526,
              "code": "210811",
              "name": "老边区",
              "areacode": "210800"
            },
            {
              "id": 527,
              "code": "210881",
              "name": "盖州市",
              "areacode": "210800"
            },
            {
              "id": 528,
              "code": "210882",
              "name": "大石桥市",
              "areacode": "210800"
            }
          ]
        },
        {
          "id": 47,
          "code": "210900",
          "name": "阜新市",
          "citycode": "210000",
          "district": [
            {
              "id": 529,
              "code": "210901",
              "name": "市辖区",
              "areacode": "210900"
            },
            {
              "id": 530,
              "code": "210902",
              "name": "海州区",
              "areacode": "210900"
            },
            {
              "id": 531,
              "code": "210903",
              "name": "新邱区",
              "areacode": "210900"
            },
            {
              "id": 532,
              "code": "210904",
              "name": "太平区",
              "areacode": "210900"
            },
            {
              "id": 533,
              "code": "210905",
              "name": "清河门区",
              "areacode": "210900"
            },
            {
              "id": 534,
              "code": "210911",
              "name": "细河区",
              "areacode": "210900"
            },
            {
              "id": 535,
              "code": "210921",
              "name": "阜新蒙古族自治县",
              "areacode": "210900"
            },
            {
              "id": 536,
              "code": "210922",
              "name": "彰武县",
              "areacode": "210900"
            }
          ]
        },
        {
          "id": 48,
          "code": "211000",
          "name": "辽阳市",
          "citycode": "210000",
          "district": [
            {
              "id": 537,
              "code": "211001",
              "name": "市辖区",
              "areacode": "211000"
            },
            {
              "id": 538,
              "code": "211002",
              "name": "白塔区",
              "areacode": "211000"
            },
            {
              "id": 539,
              "code": "211003",
              "name": "文圣区",
              "areacode": "211000"
            },
            {
              "id": 540,
              "code": "211004",
              "name": "宏伟区",
              "areacode": "211000"
            },
            {
              "id": 541,
              "code": "211005",
              "name": "弓长岭区",
              "areacode": "211000"
            },
            {
              "id": 542,
              "code": "211011",
              "name": "太子河区",
              "areacode": "211000"
            },
            {
              "id": 543,
              "code": "211021",
              "name": "辽阳县",
              "areacode": "211000"
            },
            {
              "id": 544,
              "code": "211081",
              "name": "灯塔市",
              "areacode": "211000"
            }
          ]
        },
        {
          "id": 49,
          "code": "211100",
          "name": "盘锦市",
          "citycode": "210000",
          "district": [
            {
              "id": 545,
              "code": "211101",
              "name": "市辖区",
              "areacode": "211100"
            },
            {
              "id": 546,
              "code": "211102",
              "name": "双台子区",
              "areacode": "211100"
            },
            {
              "id": 547,
              "code": "211103",
              "name": "兴隆台区",
              "areacode": "211100"
            },
            {
              "id": 548,
              "code": "211121",
              "name": "大洼县",
              "areacode": "211100"
            },
            {
              "id": 549,
              "code": "211122",
              "name": "盘山县",
              "areacode": "211100"
            }
          ]
        },
        {
          "id": 50,
          "code": "211200",
          "name": "铁岭市",
          "citycode": "210000",
          "district": [
            {
              "id": 550,
              "code": "211201",
              "name": "市辖区",
              "areacode": "211200"
            },
            {
              "id": 551,
              "code": "211202",
              "name": "银州区",
              "areacode": "211200"
            },
            {
              "id": 552,
              "code": "211204",
              "name": "清河区",
              "areacode": "211200"
            },
            {
              "id": 553,
              "code": "211221",
              "name": "铁岭县",
              "areacode": "211200"
            },
            {
              "id": 554,
              "code": "211223",
              "name": "西丰县",
              "areacode": "211200"
            },
            {
              "id": 555,
              "code": "211224",
              "name": "昌图县",
              "areacode": "211200"
            },
            {
              "id": 556,
              "code": "211281",
              "name": "调兵山市",
              "areacode": "211200"
            },
            {
              "id": 557,
              "code": "211282",
              "name": "开原市",
              "areacode": "211200"
            }
          ]
        },
        {
          "id": 51,
          "code": "211300",
          "name": "朝阳市",
          "citycode": "210000",
          "district": [
            {
              "id": 558,
              "code": "211301",
              "name": "市辖区",
              "areacode": "211300"
            },
            {
              "id": 559,
              "code": "211302",
              "name": "双塔区",
              "areacode": "211300"
            },
            {
              "id": 560,
              "code": "211303",
              "name": "龙城区",
              "areacode": "211300"
            },
            {
              "id": 561,
              "code": "211321",
              "name": "朝阳县",
              "areacode": "211300"
            },
            {
              "id": 562,
              "code": "211322",
              "name": "建平县",
              "areacode": "211300"
            },
            {
              "id": 563,
              "code": "211324",
              "name": "喀喇沁左翼蒙古族自治县",
              "areacode": "211300"
            },
            {
              "id": 564,
              "code": "211381",
              "name": "北票市",
              "areacode": "211300"
            },
            {
              "id": 565,
              "code": "211382",
              "name": "凌源市",
              "areacode": "211300"
            }
          ]
        },
        {
          "id": 52,
          "code": "211400",
          "name": "葫芦岛市",
          "citycode": "210000",
          "district": [
            {
              "id": 566,
              "code": "211401",
              "name": "市辖区",
              "areacode": "211400"
            },
            {
              "id": 567,
              "code": "211402",
              "name": "连山区",
              "areacode": "211400"
            },
            {
              "id": 568,
              "code": "211403",
              "name": "龙港区",
              "areacode": "211400"
            },
            {
              "id": 569,
              "code": "211404",
              "name": "南票区",
              "areacode": "211400"
            },
            {
              "id": 570,
              "code": "211421",
              "name": "绥中县",
              "areacode": "211400"
            },
            {
              "id": 571,
              "code": "211422",
              "name": "建昌县",
              "areacode": "211400"
            },
            {
              "id": 572,
              "code": "211481",
              "name": "兴城市",
              "areacode": "211400"
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "code": "220000",
      "name": "吉林省",
      "city": [
        {
          "id": 53,
          "code": "220100",
          "name": "长春市",
          "citycode": "220000",
          "district": [
            {
              "id": 573,
              "code": "220101",
              "name": "市辖区",
              "areacode": "220100"
            },
            {
              "id": 574,
              "code": "220102",
              "name": "南关区",
              "areacode": "220100"
            },
            {
              "id": 575,
              "code": "220103",
              "name": "宽城区",
              "areacode": "220100"
            },
            {
              "id": 576,
              "code": "220104",
              "name": "朝阳区",
              "areacode": "220100"
            },
            {
              "id": 577,
              "code": "220105",
              "name": "二道区",
              "areacode": "220100"
            },
            {
              "id": 578,
              "code": "220106",
              "name": "绿园区",
              "areacode": "220100"
            },
            {
              "id": 579,
              "code": "220112",
              "name": "双阳区",
              "areacode": "220100"
            },
            {
              "id": 580,
              "code": "220122",
              "name": "农安县",
              "areacode": "220100"
            },
            {
              "id": 581,
              "code": "220181",
              "name": "九台市",
              "areacode": "220100"
            },
            {
              "id": 582,
              "code": "220182",
              "name": "榆树市",
              "areacode": "220100"
            },
            {
              "id": 583,
              "code": "220183",
              "name": "德惠市",
              "areacode": "220100"
            }
          ]
        },
        {
          "id": 54,
          "code": "220200",
          "name": "吉林市",
          "citycode": "220000",
          "district": [
            {
              "id": 584,
              "code": "220201",
              "name": "市辖区",
              "areacode": "220200"
            },
            {
              "id": 585,
              "code": "220202",
              "name": "昌邑区",
              "areacode": "220200"
            },
            {
              "id": 586,
              "code": "220203",
              "name": "龙潭区",
              "areacode": "220200"
            },
            {
              "id": 587,
              "code": "220204",
              "name": "船营区",
              "areacode": "220200"
            },
            {
              "id": 588,
              "code": "220211",
              "name": "丰满区",
              "areacode": "220200"
            },
            {
              "id": 589,
              "code": "220221",
              "name": "永吉县",
              "areacode": "220200"
            },
            {
              "id": 590,
              "code": "220281",
              "name": "蛟河市",
              "areacode": "220200"
            },
            {
              "id": 591,
              "code": "220282",
              "name": "桦甸市",
              "areacode": "220200"
            },
            {
              "id": 592,
              "code": "220283",
              "name": "舒兰市",
              "areacode": "220200"
            },
            {
              "id": 593,
              "code": "220284",
              "name": "磐石市",
              "areacode": "220200"
            }
          ]
        },
        {
          "id": 55,
          "code": "220300",
          "name": "四平市",
          "citycode": "220000",
          "district": [
            {
              "id": 594,
              "code": "220301",
              "name": "市辖区",
              "areacode": "220300"
            },
            {
              "id": 595,
              "code": "220302",
              "name": "铁西区",
              "areacode": "220300"
            },
            {
              "id": 596,
              "code": "220303",
              "name": "铁东区",
              "areacode": "220300"
            },
            {
              "id": 597,
              "code": "220322",
              "name": "梨树县",
              "areacode": "220300"
            },
            {
              "id": 598,
              "code": "220323",
              "name": "伊通满族自治县",
              "areacode": "220300"
            },
            {
              "id": 599,
              "code": "220381",
              "name": "公主岭市",
              "areacode": "220300"
            },
            {
              "id": 600,
              "code": "220382",
              "name": "双辽市",
              "areacode": "220300"
            }
          ]
        },
        {
          "id": 56,
          "code": "220400",
          "name": "辽源市",
          "citycode": "220000",
          "district": [
            {
              "id": 601,
              "code": "220401",
              "name": "市辖区",
              "areacode": "220400"
            },
            {
              "id": 602,
              "code": "220402",
              "name": "龙山区",
              "areacode": "220400"
            },
            {
              "id": 603,
              "code": "220403",
              "name": "西安区",
              "areacode": "220400"
            },
            {
              "id": 604,
              "code": "220421",
              "name": "东丰县",
              "areacode": "220400"
            },
            {
              "id": 605,
              "code": "220422",
              "name": "东辽县",
              "areacode": "220400"
            }
          ]
        },
        {
          "id": 57,
          "code": "220500",
          "name": "通化市",
          "citycode": "220000",
          "district": [
            {
              "id": 606,
              "code": "220501",
              "name": "市辖区",
              "areacode": "220500"
            },
            {
              "id": 607,
              "code": "220502",
              "name": "东昌区",
              "areacode": "220500"
            },
            {
              "id": 608,
              "code": "220503",
              "name": "二道江区",
              "areacode": "220500"
            },
            {
              "id": 609,
              "code": "220521",
              "name": "通化县",
              "areacode": "220500"
            },
            {
              "id": 610,
              "code": "220523",
              "name": "辉南县",
              "areacode": "220500"
            },
            {
              "id": 611,
              "code": "220524",
              "name": "柳河县",
              "areacode": "220500"
            },
            {
              "id": 612,
              "code": "220581",
              "name": "梅河口市",
              "areacode": "220500"
            },
            {
              "id": 613,
              "code": "220582",
              "name": "集安市",
              "areacode": "220500"
            }
          ]
        },
        {
          "id": 58,
          "code": "220600",
          "name": "白山市",
          "citycode": "220000",
          "district": [
            {
              "id": 614,
              "code": "220601",
              "name": "市辖区",
              "areacode": "220600"
            },
            {
              "id": 615,
              "code": "220602",
              "name": "八道江区",
              "areacode": "220600"
            },
            {
              "id": 616,
              "code": "220621",
              "name": "抚松县",
              "areacode": "220600"
            },
            {
              "id": 617,
              "code": "220622",
              "name": "靖宇县",
              "areacode": "220600"
            },
            {
              "id": 618,
              "code": "220623",
              "name": "长白朝鲜族自治县",
              "areacode": "220600"
            },
            {
              "id": 619,
              "code": "220625",
              "name": "江源县",
              "areacode": "220600"
            },
            {
              "id": 620,
              "code": "220681",
              "name": "临江市",
              "areacode": "220600"
            }
          ]
        },
        {
          "id": 59,
          "code": "220700",
          "name": "松原市",
          "citycode": "220000",
          "district": [
            {
              "id": 621,
              "code": "220701",
              "name": "市辖区",
              "areacode": "220700"
            },
            {
              "id": 622,
              "code": "220702",
              "name": "宁江区",
              "areacode": "220700"
            },
            {
              "id": 623,
              "code": "220721",
              "name": "前郭尔罗斯蒙古族自治县",
              "areacode": "220700"
            },
            {
              "id": 624,
              "code": "220722",
              "name": "长岭县",
              "areacode": "220700"
            },
            {
              "id": 625,
              "code": "220723",
              "name": "乾安县",
              "areacode": "220700"
            },
            {
              "id": 626,
              "code": "220724",
              "name": "扶余县",
              "areacode": "220700"
            }
          ]
        },
        {
          "id": 60,
          "code": "220800",
          "name": "白城市",
          "citycode": "220000",
          "district": [
            {
              "id": 627,
              "code": "220801",
              "name": "市辖区",
              "areacode": "220800"
            },
            {
              "id": 628,
              "code": "220802",
              "name": "洮北区",
              "areacode": "220800"
            },
            {
              "id": 629,
              "code": "220821",
              "name": "镇赉县",
              "areacode": "220800"
            },
            {
              "id": 630,
              "code": "220822",
              "name": "通榆县",
              "areacode": "220800"
            },
            {
              "id": 631,
              "code": "220881",
              "name": "洮南市",
              "areacode": "220800"
            },
            {
              "id": 632,
              "code": "220882",
              "name": "大安市",
              "areacode": "220800"
            }
          ]
        },
        {
          "id": 61,
          "code": "222400",
          "name": "延边朝鲜族自治州",
          "citycode": "220000",
          "district": [
            {
              "id": 633,
              "code": "222401",
              "name": "延吉市",
              "areacode": "222400"
            },
            {
              "id": 634,
              "code": "222402",
              "name": "图们市",
              "areacode": "222400"
            },
            {
              "id": 635,
              "code": "222403",
              "name": "敦化市",
              "areacode": "222400"
            },
            {
              "id": 636,
              "code": "222404",
              "name": "珲春市",
              "areacode": "222400"
            },
            {
              "id": 637,
              "code": "222405",
              "name": "龙井市",
              "areacode": "222400"
            },
            {
              "id": 638,
              "code": "222406",
              "name": "和龙市",
              "areacode": "222400"
            },
            {
              "id": 639,
              "code": "222424",
              "name": "汪清县",
              "areacode": "222400"
            },
            {
              "id": 640,
              "code": "222426",
              "name": "安图县",
              "areacode": "222400"
            }
          ]
        }
      ]
    },
    {
      "id": 8,
      "code": "230000",
      "name": "黑龙江省",
      "city": [
        {
          "id": 62,
          "code": "230100",
          "name": "哈尔滨市",
          "citycode": "230000",
          "district": [
            {
              "id": 641,
              "code": "230101",
              "name": "市辖区",
              "areacode": "230100"
            },
            {
              "id": 642,
              "code": "230102",
              "name": "道里区",
              "areacode": "230100"
            },
            {
              "id": 643,
              "code": "230103",
              "name": "南岗区",
              "areacode": "230100"
            },
            {
              "id": 644,
              "code": "230104",
              "name": "道外区",
              "areacode": "230100"
            },
            {
              "id": 645,
              "code": "230106",
              "name": "香坊区",
              "areacode": "230100"
            },
            {
              "id": 646,
              "code": "230107",
              "name": "动力区",
              "areacode": "230100"
            },
            {
              "id": 647,
              "code": "230108",
              "name": "平房区",
              "areacode": "230100"
            },
            {
              "id": 648,
              "code": "230109",
              "name": "松北区",
              "areacode": "230100"
            },
            {
              "id": 649,
              "code": "230111",
              "name": "呼兰区",
              "areacode": "230100"
            },
            {
              "id": 650,
              "code": "230123",
              "name": "依兰县",
              "areacode": "230100"
            },
            {
              "id": 651,
              "code": "230124",
              "name": "方正县",
              "areacode": "230100"
            },
            {
              "id": 652,
              "code": "230125",
              "name": "宾　县",
              "areacode": "230100"
            },
            {
              "id": 653,
              "code": "230126",
              "name": "巴彦县",
              "areacode": "230100"
            },
            {
              "id": 654,
              "code": "230127",
              "name": "木兰县",
              "areacode": "230100"
            },
            {
              "id": 655,
              "code": "230128",
              "name": "通河县",
              "areacode": "230100"
            },
            {
              "id": 656,
              "code": "230129",
              "name": "延寿县",
              "areacode": "230100"
            },
            {
              "id": 657,
              "code": "230181",
              "name": "阿城市",
              "areacode": "230100"
            },
            {
              "id": 658,
              "code": "230182",
              "name": "双城市",
              "areacode": "230100"
            },
            {
              "id": 659,
              "code": "230183",
              "name": "尚志市",
              "areacode": "230100"
            },
            {
              "id": 660,
              "code": "230184",
              "name": "五常市",
              "areacode": "230100"
            }
          ]
        },
        {
          "id": 63,
          "code": "230200",
          "name": "齐齐哈尔市",
          "citycode": "230000",
          "district": [
            {
              "id": 661,
              "code": "230201",
              "name": "市辖区",
              "areacode": "230200"
            },
            {
              "id": 662,
              "code": "230202",
              "name": "龙沙区",
              "areacode": "230200"
            },
            {
              "id": 663,
              "code": "230203",
              "name": "建华区",
              "areacode": "230200"
            },
            {
              "id": 664,
              "code": "230204",
              "name": "铁锋区",
              "areacode": "230200"
            },
            {
              "id": 665,
              "code": "230205",
              "name": "昂昂溪区",
              "areacode": "230200"
            },
            {
              "id": 666,
              "code": "230206",
              "name": "富拉尔基区",
              "areacode": "230200"
            },
            {
              "id": 667,
              "code": "230207",
              "name": "碾子山区",
              "areacode": "230200"
            },
            {
              "id": 668,
              "code": "230208",
              "name": "梅里斯达斡尔族区",
              "areacode": "230200"
            },
            {
              "id": 669,
              "code": "230221",
              "name": "龙江县",
              "areacode": "230200"
            },
            {
              "id": 670,
              "code": "230223",
              "name": "依安县",
              "areacode": "230200"
            },
            {
              "id": 671,
              "code": "230224",
              "name": "泰来县",
              "areacode": "230200"
            },
            {
              "id": 672,
              "code": "230225",
              "name": "甘南县",
              "areacode": "230200"
            },
            {
              "id": 673,
              "code": "230227",
              "name": "富裕县",
              "areacode": "230200"
            },
            {
              "id": 674,
              "code": "230229",
              "name": "克山县",
              "areacode": "230200"
            },
            {
              "id": 675,
              "code": "230230",
              "name": "克东县",
              "areacode": "230200"
            },
            {
              "id": 676,
              "code": "230231",
              "name": "拜泉县",
              "areacode": "230200"
            },
            {
              "id": 677,
              "code": "230281",
              "name": "讷河市",
              "areacode": "230200"
            }
          ]
        },
        {
          "id": 64,
          "code": "230300",
          "name": "鸡西市",
          "citycode": "230000",
          "district": [
            {
              "id": 678,
              "code": "230301",
              "name": "市辖区",
              "areacode": "230300"
            },
            {
              "id": 679,
              "code": "230302",
              "name": "鸡冠区",
              "areacode": "230300"
            },
            {
              "id": 680,
              "code": "230303",
              "name": "恒山区",
              "areacode": "230300"
            },
            {
              "id": 681,
              "code": "230304",
              "name": "滴道区",
              "areacode": "230300"
            },
            {
              "id": 682,
              "code": "230305",
              "name": "梨树区",
              "areacode": "230300"
            },
            {
              "id": 683,
              "code": "230306",
              "name": "城子河区",
              "areacode": "230300"
            },
            {
              "id": 684,
              "code": "230307",
              "name": "麻山区",
              "areacode": "230300"
            },
            {
              "id": 685,
              "code": "230321",
              "name": "鸡东县",
              "areacode": "230300"
            },
            {
              "id": 686,
              "code": "230381",
              "name": "虎林市",
              "areacode": "230300"
            },
            {
              "id": 687,
              "code": "230382",
              "name": "密山市",
              "areacode": "230300"
            }
          ]
        },
        {
          "id": 65,
          "code": "230400",
          "name": "鹤岗市",
          "citycode": "230000",
          "district": [
            {
              "id": 688,
              "code": "230401",
              "name": "市辖区",
              "areacode": "230400"
            },
            {
              "id": 689,
              "code": "230402",
              "name": "向阳区",
              "areacode": "230400"
            },
            {
              "id": 690,
              "code": "230403",
              "name": "工农区",
              "areacode": "230400"
            },
            {
              "id": 691,
              "code": "230404",
              "name": "南山区",
              "areacode": "230400"
            },
            {
              "id": 692,
              "code": "230405",
              "name": "兴安区",
              "areacode": "230400"
            },
            {
              "id": 693,
              "code": "230406",
              "name": "东山区",
              "areacode": "230400"
            },
            {
              "id": 694,
              "code": "230407",
              "name": "兴山区",
              "areacode": "230400"
            },
            {
              "id": 695,
              "code": "230421",
              "name": "萝北县",
              "areacode": "230400"
            },
            {
              "id": 696,
              "code": "230422",
              "name": "绥滨县",
              "areacode": "230400"
            }
          ]
        },
        {
          "id": 66,
          "code": "230500",
          "name": "双鸭山市",
          "citycode": "230000",
          "district": [
            {
              "id": 697,
              "code": "230501",
              "name": "市辖区",
              "areacode": "230500"
            },
            {
              "id": 698,
              "code": "230502",
              "name": "尖山区",
              "areacode": "230500"
            },
            {
              "id": 699,
              "code": "230503",
              "name": "岭东区",
              "areacode": "230500"
            },
            {
              "id": 700,
              "code": "230505",
              "name": "四方台区",
              "areacode": "230500"
            },
            {
              "id": 701,
              "code": "230506",
              "name": "宝山区",
              "areacode": "230500"
            },
            {
              "id": 702,
              "code": "230521",
              "name": "集贤县",
              "areacode": "230500"
            },
            {
              "id": 703,
              "code": "230522",
              "name": "友谊县",
              "areacode": "230500"
            },
            {
              "id": 704,
              "code": "230523",
              "name": "宝清县",
              "areacode": "230500"
            },
            {
              "id": 705,
              "code": "230524",
              "name": "饶河县",
              "areacode": "230500"
            }
          ]
        },
        {
          "id": 67,
          "code": "230600",
          "name": "大庆市",
          "citycode": "230000",
          "district": [
            {
              "id": 706,
              "code": "230601",
              "name": "市辖区",
              "areacode": "230600"
            },
            {
              "id": 707,
              "code": "230602",
              "name": "萨尔图区",
              "areacode": "230600"
            },
            {
              "id": 708,
              "code": "230603",
              "name": "龙凤区",
              "areacode": "230600"
            },
            {
              "id": 709,
              "code": "230604",
              "name": "让胡路区",
              "areacode": "230600"
            },
            {
              "id": 710,
              "code": "230605",
              "name": "红岗区",
              "areacode": "230600"
            },
            {
              "id": 711,
              "code": "230606",
              "name": "大同区",
              "areacode": "230600"
            },
            {
              "id": 712,
              "code": "230621",
              "name": "肇州县",
              "areacode": "230600"
            },
            {
              "id": 713,
              "code": "230622",
              "name": "肇源县",
              "areacode": "230600"
            },
            {
              "id": 714,
              "code": "230623",
              "name": "林甸县",
              "areacode": "230600"
            },
            {
              "id": 715,
              "code": "230624",
              "name": "杜尔伯特蒙古族自治县",
              "areacode": "230600"
            }
          ]
        },
        {
          "id": 68,
          "code": "230700",
          "name": "伊春市",
          "citycode": "230000",
          "district": [
            {
              "id": 716,
              "code": "230701",
              "name": "市辖区",
              "areacode": "230700"
            },
            {
              "id": 717,
              "code": "230702",
              "name": "伊春区",
              "areacode": "230700"
            },
            {
              "id": 718,
              "code": "230703",
              "name": "南岔区",
              "areacode": "230700"
            },
            {
              "id": 719,
              "code": "230704",
              "name": "友好区",
              "areacode": "230700"
            },
            {
              "id": 720,
              "code": "230705",
              "name": "西林区",
              "areacode": "230700"
            },
            {
              "id": 721,
              "code": "230706",
              "name": "翠峦区",
              "areacode": "230700"
            },
            {
              "id": 722,
              "code": "230707",
              "name": "新青区",
              "areacode": "230700"
            },
            {
              "id": 723,
              "code": "230708",
              "name": "美溪区",
              "areacode": "230700"
            },
            {
              "id": 724,
              "code": "230709",
              "name": "金山屯区",
              "areacode": "230700"
            },
            {
              "id": 725,
              "code": "230710",
              "name": "五营区",
              "areacode": "230700"
            },
            {
              "id": 726,
              "code": "230711",
              "name": "乌马河区",
              "areacode": "230700"
            },
            {
              "id": 727,
              "code": "230712",
              "name": "汤旺河区",
              "areacode": "230700"
            },
            {
              "id": 728,
              "code": "230713",
              "name": "带岭区",
              "areacode": "230700"
            },
            {
              "id": 729,
              "code": "230714",
              "name": "乌伊岭区",
              "areacode": "230700"
            },
            {
              "id": 730,
              "code": "230715",
              "name": "红星区",
              "areacode": "230700"
            },
            {
              "id": 731,
              "code": "230716",
              "name": "上甘岭区",
              "areacode": "230700"
            },
            {
              "id": 732,
              "code": "230722",
              "name": "嘉荫县",
              "areacode": "230700"
            },
            {
              "id": 733,
              "code": "230781",
              "name": "铁力市",
              "areacode": "230700"
            }
          ]
        },
        {
          "id": 69,
          "code": "230800",
          "name": "佳木斯市",
          "citycode": "230000",
          "district": [
            {
              "id": 734,
              "code": "230801",
              "name": "市辖区",
              "areacode": "230800"
            },
            {
              "id": 735,
              "code": "230802",
              "name": "永红区",
              "areacode": "230800"
            },
            {
              "id": 736,
              "code": "230803",
              "name": "向阳区",
              "areacode": "230800"
            },
            {
              "id": 737,
              "code": "230804",
              "name": "前进区",
              "areacode": "230800"
            },
            {
              "id": 738,
              "code": "230805",
              "name": "东风区",
              "areacode": "230800"
            },
            {
              "id": 739,
              "code": "230811",
              "name": "郊　区",
              "areacode": "230800"
            },
            {
              "id": 740,
              "code": "230822",
              "name": "桦南县",
              "areacode": "230800"
            },
            {
              "id": 741,
              "code": "230826",
              "name": "桦川县",
              "areacode": "230800"
            },
            {
              "id": 742,
              "code": "230828",
              "name": "汤原县",
              "areacode": "230800"
            },
            {
              "id": 743,
              "code": "230833",
              "name": "抚远县",
              "areacode": "230800"
            },
            {
              "id": 744,
              "code": "230881",
              "name": "同江市",
              "areacode": "230800"
            },
            {
              "id": 745,
              "code": "230882",
              "name": "富锦市",
              "areacode": "230800"
            }
          ]
        },
        {
          "id": 70,
          "code": "230900",
          "name": "七台河市",
          "citycode": "230000",
          "district": [
            {
              "id": 746,
              "code": "230901",
              "name": "市辖区",
              "areacode": "230900"
            },
            {
              "id": 747,
              "code": "230902",
              "name": "新兴区",
              "areacode": "230900"
            },
            {
              "id": 748,
              "code": "230903",
              "name": "桃山区",
              "areacode": "230900"
            },
            {
              "id": 749,
              "code": "230904",
              "name": "茄子河区",
              "areacode": "230900"
            },
            {
              "id": 750,
              "code": "230921",
              "name": "勃利县",
              "areacode": "230900"
            }
          ]
        },
        {
          "id": 71,
          "code": "231000",
          "name": "牡丹江市",
          "citycode": "230000",
          "district": [
            {
              "id": 751,
              "code": "231001",
              "name": "市辖区",
              "areacode": "231000"
            },
            {
              "id": 752,
              "code": "231002",
              "name": "东安区",
              "areacode": "231000"
            },
            {
              "id": 753,
              "code": "231003",
              "name": "阳明区",
              "areacode": "231000"
            },
            {
              "id": 754,
              "code": "231004",
              "name": "爱民区",
              "areacode": "231000"
            },
            {
              "id": 755,
              "code": "231005",
              "name": "西安区",
              "areacode": "231000"
            },
            {
              "id": 756,
              "code": "231024",
              "name": "东宁县",
              "areacode": "231000"
            },
            {
              "id": 757,
              "code": "231025",
              "name": "林口县",
              "areacode": "231000"
            },
            {
              "id": 758,
              "code": "231081",
              "name": "绥芬河市",
              "areacode": "231000"
            },
            {
              "id": 759,
              "code": "231083",
              "name": "海林市",
              "areacode": "231000"
            },
            {
              "id": 760,
              "code": "231084",
              "name": "宁安市",
              "areacode": "231000"
            },
            {
              "id": 761,
              "code": "231085",
              "name": "穆棱市",
              "areacode": "231000"
            }
          ]
        },
        {
          "id": 72,
          "code": "231100",
          "name": "黑河市",
          "citycode": "230000",
          "district": [
            {
              "id": 762,
              "code": "231101",
              "name": "市辖区",
              "areacode": "231100"
            },
            {
              "id": 763,
              "code": "231102",
              "name": "爱辉区",
              "areacode": "231100"
            },
            {
              "id": 764,
              "code": "231121",
              "name": "嫩江县",
              "areacode": "231100"
            },
            {
              "id": 765,
              "code": "231123",
              "name": "逊克县",
              "areacode": "231100"
            },
            {
              "id": 766,
              "code": "231124",
              "name": "孙吴县",
              "areacode": "231100"
            },
            {
              "id": 767,
              "code": "231181",
              "name": "北安市",
              "areacode": "231100"
            },
            {
              "id": 768,
              "code": "231182",
              "name": "五大连池市",
              "areacode": "231100"
            }
          ]
        },
        {
          "id": 73,
          "code": "231200",
          "name": "绥化市",
          "citycode": "230000",
          "district": [
            {
              "id": 769,
              "code": "231201",
              "name": "市辖区",
              "areacode": "231200"
            },
            {
              "id": 770,
              "code": "231202",
              "name": "北林区",
              "areacode": "231200"
            },
            {
              "id": 771,
              "code": "231221",
              "name": "望奎县",
              "areacode": "231200"
            },
            {
              "id": 772,
              "code": "231222",
              "name": "兰西县",
              "areacode": "231200"
            },
            {
              "id": 773,
              "code": "231223",
              "name": "青冈县",
              "areacode": "231200"
            },
            {
              "id": 774,
              "code": "231224",
              "name": "庆安县",
              "areacode": "231200"
            },
            {
              "id": 775,
              "code": "231225",
              "name": "明水县",
              "areacode": "231200"
            },
            {
              "id": 776,
              "code": "231226",
              "name": "绥棱县",
              "areacode": "231200"
            },
            {
              "id": 777,
              "code": "231281",
              "name": "安达市",
              "areacode": "231200"
            },
            {
              "id": 778,
              "code": "231282",
              "name": "肇东市",
              "areacode": "231200"
            },
            {
              "id": 779,
              "code": "231283",
              "name": "海伦市",
              "areacode": "231200"
            }
          ]
        },
        {
          "id": 74,
          "code": "232700",
          "name": "大兴安岭地区",
          "citycode": "230000",
          "district": [
            {
              "id": 780,
              "code": "232721",
              "name": "呼玛县",
              "areacode": "232700"
            },
            {
              "id": 781,
              "code": "232722",
              "name": "塔河县",
              "areacode": "232700"
            },
            {
              "id": 782,
              "code": "232723",
              "name": "漠河县",
              "areacode": "232700"
            }
          ]
        }
      ]
    },
    {
      "id": 9,
      "code": "310000",
      "name": "上海市",
      "city": [
        {
          "id": 75,
          "code": "310100",
          "name": "市辖区",
          "citycode": "310000",
          "district": [
            {
              "id": 783,
              "code": "310101",
              "name": "黄浦区",
              "areacode": "310100"
            },
            {
              "id": 784,
              "code": "310103",
              "name": "卢湾区",
              "areacode": "310100"
            },
            {
              "id": 785,
              "code": "310104",
              "name": "徐汇区",
              "areacode": "310100"
            },
            {
              "id": 786,
              "code": "310105",
              "name": "长宁区",
              "areacode": "310100"
            },
            {
              "id": 787,
              "code": "310106",
              "name": "静安区",
              "areacode": "310100"
            },
            {
              "id": 788,
              "code": "310107",
              "name": "普陀区",
              "areacode": "310100"
            },
            {
              "id": 789,
              "code": "310108",
              "name": "闸北区",
              "areacode": "310100"
            },
            {
              "id": 790,
              "code": "310109",
              "name": "虹口区",
              "areacode": "310100"
            },
            {
              "id": 791,
              "code": "310110",
              "name": "杨浦区",
              "areacode": "310100"
            },
            {
              "id": 792,
              "code": "310112",
              "name": "闵行区",
              "areacode": "310100"
            },
            {
              "id": 793,
              "code": "310113",
              "name": "宝山区",
              "areacode": "310100"
            },
            {
              "id": 794,
              "code": "310114",
              "name": "嘉定区",
              "areacode": "310100"
            },
            {
              "id": 795,
              "code": "310115",
              "name": "浦东新区",
              "areacode": "310100"
            },
            {
              "id": 796,
              "code": "310116",
              "name": "金山区",
              "areacode": "310100"
            },
            {
              "id": 797,
              "code": "310117",
              "name": "松江区",
              "areacode": "310100"
            },
            {
              "id": 798,
              "code": "310118",
              "name": "青浦区",
              "areacode": "310100"
            },
            {
              "id": 799,
              "code": "310119",
              "name": "南汇区",
              "areacode": "310100"
            },
            {
              "id": 800,
              "code": "310120",
              "name": "奉贤区",
              "areacode": "310100"
            }
          ]
        },
        {
          "id": 76,
          "code": "310200",
          "name": "县",
          "citycode": "310000",
          "district": [
            {
              "id": 801,
              "code": "310230",
              "name": "崇明县",
              "areacode": "310200"
            }
          ]
        }
      ]
    },
    {
      "id": 10,
      "code": "320000",
      "name": "江苏省",
      "city": [
        {
          "id": 77,
          "code": "320100",
          "name": "南京市",
          "citycode": "320000",
          "district": [
            {
              "id": 802,
              "code": "320101",
              "name": "市辖区",
              "areacode": "320100"
            },
            {
              "id": 803,
              "code": "320102",
              "name": "玄武区",
              "areacode": "320100"
            },
            {
              "id": 804,
              "code": "320103",
              "name": "白下区",
              "areacode": "320100"
            },
            {
              "id": 805,
              "code": "320104",
              "name": "秦淮区",
              "areacode": "320100"
            },
            {
              "id": 806,
              "code": "320105",
              "name": "建邺区",
              "areacode": "320100"
            },
            {
              "id": 807,
              "code": "320106",
              "name": "鼓楼区",
              "areacode": "320100"
            },
            {
              "id": 808,
              "code": "320107",
              "name": "下关区",
              "areacode": "320100"
            },
            {
              "id": 809,
              "code": "320111",
              "name": "浦口区",
              "areacode": "320100"
            },
            {
              "id": 810,
              "code": "320113",
              "name": "栖霞区",
              "areacode": "320100"
            },
            {
              "id": 811,
              "code": "320114",
              "name": "雨花台区",
              "areacode": "320100"
            },
            {
              "id": 812,
              "code": "320115",
              "name": "江宁区",
              "areacode": "320100"
            },
            {
              "id": 813,
              "code": "320116",
              "name": "六合区",
              "areacode": "320100"
            },
            {
              "id": 814,
              "code": "320124",
              "name": "溧水县",
              "areacode": "320100"
            },
            {
              "id": 815,
              "code": "320125",
              "name": "高淳县",
              "areacode": "320100"
            }
          ]
        },
        {
          "id": 78,
          "code": "320200",
          "name": "无锡市",
          "citycode": "320000",
          "district": [
            {
              "id": 816,
              "code": "320201",
              "name": "市辖区",
              "areacode": "320200"
            },
            {
              "id": 817,
              "code": "320202",
              "name": "崇安区",
              "areacode": "320200"
            },
            {
              "id": 818,
              "code": "320203",
              "name": "南长区",
              "areacode": "320200"
            },
            {
              "id": 819,
              "code": "320204",
              "name": "北塘区",
              "areacode": "320200"
            },
            {
              "id": 820,
              "code": "320205",
              "name": "锡山区",
              "areacode": "320200"
            },
            {
              "id": 821,
              "code": "320206",
              "name": "惠山区",
              "areacode": "320200"
            },
            {
              "id": 822,
              "code": "320211",
              "name": "滨湖区",
              "areacode": "320200"
            },
            {
              "id": 823,
              "code": "320281",
              "name": "江阴市",
              "areacode": "320200"
            },
            {
              "id": 824,
              "code": "320282",
              "name": "宜兴市",
              "areacode": "320200"
            }
          ]
        },
        {
          "id": 79,
          "code": "320300",
          "name": "徐州市",
          "citycode": "320000",
          "district": [
            {
              "id": 825,
              "code": "320301",
              "name": "市辖区",
              "areacode": "320300"
            },
            {
              "id": 826,
              "code": "320302",
              "name": "鼓楼区",
              "areacode": "320300"
            },
            {
              "id": 827,
              "code": "320303",
              "name": "云龙区",
              "areacode": "320300"
            },
            {
              "id": 828,
              "code": "320304",
              "name": "九里区",
              "areacode": "320300"
            },
            {
              "id": 829,
              "code": "320305",
              "name": "贾汪区",
              "areacode": "320300"
            },
            {
              "id": 830,
              "code": "320311",
              "name": "泉山区",
              "areacode": "320300"
            },
            {
              "id": 831,
              "code": "320321",
              "name": "丰　县",
              "areacode": "320300"
            },
            {
              "id": 832,
              "code": "320322",
              "name": "沛　县",
              "areacode": "320300"
            },
            {
              "id": 833,
              "code": "320323",
              "name": "铜山县",
              "areacode": "320300"
            },
            {
              "id": 834,
              "code": "320324",
              "name": "睢宁县",
              "areacode": "320300"
            },
            {
              "id": 835,
              "code": "320381",
              "name": "新沂市",
              "areacode": "320300"
            },
            {
              "id": 836,
              "code": "320382",
              "name": "邳州市",
              "areacode": "320300"
            }
          ]
        },
        {
          "id": 80,
          "code": "320400",
          "name": "常州市",
          "citycode": "320000",
          "district": [
            {
              "id": 837,
              "code": "320401",
              "name": "市辖区",
              "areacode": "320400"
            },
            {
              "id": 838,
              "code": "320402",
              "name": "天宁区",
              "areacode": "320400"
            },
            {
              "id": 839,
              "code": "320404",
              "name": "钟楼区",
              "areacode": "320400"
            },
            {
              "id": 840,
              "code": "320405",
              "name": "戚墅堰区",
              "areacode": "320400"
            },
            {
              "id": 841,
              "code": "320411",
              "name": "新北区",
              "areacode": "320400"
            },
            {
              "id": 842,
              "code": "320412",
              "name": "武进区",
              "areacode": "320400"
            },
            {
              "id": 843,
              "code": "320481",
              "name": "溧阳市",
              "areacode": "320400"
            },
            {
              "id": 844,
              "code": "320482",
              "name": "金坛市",
              "areacode": "320400"
            }
          ]
        },
        {
          "id": 81,
          "code": "320500",
          "name": "苏州市",
          "citycode": "320000",
          "district": [
            {
              "id": 845,
              "code": "320501",
              "name": "市辖区",
              "areacode": "320500"
            },
            {
              "id": 846,
              "code": "320502",
              "name": "沧浪区",
              "areacode": "320500"
            },
            {
              "id": 847,
              "code": "320503",
              "name": "平江区",
              "areacode": "320500"
            },
            {
              "id": 848,
              "code": "320504",
              "name": "金阊区",
              "areacode": "320500"
            },
            {
              "id": 849,
              "code": "320505",
              "name": "虎丘区",
              "areacode": "320500"
            },
            {
              "id": 850,
              "code": "320506",
              "name": "吴中区",
              "areacode": "320500"
            },
            {
              "id": 851,
              "code": "320507",
              "name": "相城区",
              "areacode": "320500"
            },
            {
              "id": 852,
              "code": "320581",
              "name": "常熟市",
              "areacode": "320500"
            },
            {
              "id": 853,
              "code": "320582",
              "name": "张家港市",
              "areacode": "320500"
            },
            {
              "id": 854,
              "code": "320583",
              "name": "昆山市",
              "areacode": "320500"
            },
            {
              "id": 855,
              "code": "320584",
              "name": "吴江市",
              "areacode": "320500"
            },
            {
              "id": 856,
              "code": "320585",
              "name": "太仓市",
              "areacode": "320500"
            }
          ]
        },
        {
          "id": 82,
          "code": "320600",
          "name": "南通市",
          "citycode": "320000",
          "district": [
            {
              "id": 857,
              "code": "320601",
              "name": "市辖区",
              "areacode": "320600"
            },
            {
              "id": 858,
              "code": "320602",
              "name": "崇川区",
              "areacode": "320600"
            },
            {
              "id": 859,
              "code": "320611",
              "name": "港闸区",
              "areacode": "320600"
            },
            {
              "id": 860,
              "code": "320621",
              "name": "海安县",
              "areacode": "320600"
            },
            {
              "id": 861,
              "code": "320623",
              "name": "如东县",
              "areacode": "320600"
            },
            {
              "id": 862,
              "code": "320681",
              "name": "启东市",
              "areacode": "320600"
            },
            {
              "id": 863,
              "code": "320682",
              "name": "如皋市",
              "areacode": "320600"
            },
            {
              "id": 864,
              "code": "320683",
              "name": "通州市",
              "areacode": "320600"
            },
            {
              "id": 865,
              "code": "320684",
              "name": "海门市",
              "areacode": "320600"
            }
          ]
        },
        {
          "id": 83,
          "code": "320700",
          "name": "连云港市",
          "citycode": "320000",
          "district": [
            {
              "id": 866,
              "code": "320701",
              "name": "市辖区",
              "areacode": "320700"
            },
            {
              "id": 867,
              "code": "320703",
              "name": "连云区",
              "areacode": "320700"
            },
            {
              "id": 868,
              "code": "320705",
              "name": "新浦区",
              "areacode": "320700"
            },
            {
              "id": 869,
              "code": "320706",
              "name": "海州区",
              "areacode": "320700"
            },
            {
              "id": 870,
              "code": "320721",
              "name": "赣榆县",
              "areacode": "320700"
            },
            {
              "id": 871,
              "code": "320722",
              "name": "东海县",
              "areacode": "320700"
            },
            {
              "id": 872,
              "code": "320723",
              "name": "灌云县",
              "areacode": "320700"
            },
            {
              "id": 873,
              "code": "320724",
              "name": "灌南县",
              "areacode": "320700"
            }
          ]
        },
        {
          "id": 84,
          "code": "320800",
          "name": "淮安市",
          "citycode": "320000",
          "district": [
            {
              "id": 874,
              "code": "320801",
              "name": "市辖区",
              "areacode": "320800"
            },
            {
              "id": 875,
              "code": "320802",
              "name": "清河区",
              "areacode": "320800"
            },
            {
              "id": 876,
              "code": "320803",
              "name": "楚州区",
              "areacode": "320800"
            },
            {
              "id": 877,
              "code": "320804",
              "name": "淮阴区",
              "areacode": "320800"
            },
            {
              "id": 878,
              "code": "320811",
              "name": "清浦区",
              "areacode": "320800"
            },
            {
              "id": 879,
              "code": "320826",
              "name": "涟水县",
              "areacode": "320800"
            },
            {
              "id": 880,
              "code": "320829",
              "name": "洪泽县",
              "areacode": "320800"
            },
            {
              "id": 881,
              "code": "320830",
              "name": "盱眙县",
              "areacode": "320800"
            },
            {
              "id": 882,
              "code": "320831",
              "name": "金湖县",
              "areacode": "320800"
            }
          ]
        },
        {
          "id": 85,
          "code": "320900",
          "name": "盐城市",
          "citycode": "320000",
          "district": [
            {
              "id": 883,
              "code": "320901",
              "name": "市辖区",
              "areacode": "320900"
            },
            {
              "id": 884,
              "code": "320902",
              "name": "亭湖区",
              "areacode": "320900"
            },
            {
              "id": 885,
              "code": "320903",
              "name": "盐都区",
              "areacode": "320900"
            },
            {
              "id": 886,
              "code": "320921",
              "name": "响水县",
              "areacode": "320900"
            },
            {
              "id": 887,
              "code": "320922",
              "name": "滨海县",
              "areacode": "320900"
            },
            {
              "id": 888,
              "code": "320923",
              "name": "阜宁县",
              "areacode": "320900"
            },
            {
              "id": 889,
              "code": "320924",
              "name": "射阳县",
              "areacode": "320900"
            },
            {
              "id": 890,
              "code": "320925",
              "name": "建湖县",
              "areacode": "320900"
            },
            {
              "id": 891,
              "code": "320981",
              "name": "东台市",
              "areacode": "320900"
            },
            {
              "id": 892,
              "code": "320982",
              "name": "大丰市",
              "areacode": "320900"
            }
          ]
        },
        {
          "id": 86,
          "code": "321000",
          "name": "扬州市",
          "citycode": "320000",
          "district": [
            {
              "id": 893,
              "code": "321001",
              "name": "市辖区",
              "areacode": "321000"
            },
            {
              "id": 894,
              "code": "321002",
              "name": "广陵区",
              "areacode": "321000"
            },
            {
              "id": 895,
              "code": "321003",
              "name": "邗江区",
              "areacode": "321000"
            },
            {
              "id": 896,
              "code": "321011",
              "name": "郊　区",
              "areacode": "321000"
            },
            {
              "id": 897,
              "code": "321023",
              "name": "宝应县",
              "areacode": "321000"
            },
            {
              "id": 898,
              "code": "321081",
              "name": "仪征市",
              "areacode": "321000"
            },
            {
              "id": 899,
              "code": "321084",
              "name": "高邮市",
              "areacode": "321000"
            },
            {
              "id": 900,
              "code": "321088",
              "name": "江都市",
              "areacode": "321000"
            }
          ]
        },
        {
          "id": 87,
          "code": "321100",
          "name": "镇江市",
          "citycode": "320000",
          "district": [
            {
              "id": 901,
              "code": "321101",
              "name": "市辖区",
              "areacode": "321100"
            },
            {
              "id": 902,
              "code": "321102",
              "name": "京口区",
              "areacode": "321100"
            },
            {
              "id": 903,
              "code": "321111",
              "name": "润州区",
              "areacode": "321100"
            },
            {
              "id": 904,
              "code": "321112",
              "name": "丹徒区",
              "areacode": "321100"
            },
            {
              "id": 905,
              "code": "321181",
              "name": "丹阳市",
              "areacode": "321100"
            },
            {
              "id": 906,
              "code": "321182",
              "name": "扬中市",
              "areacode": "321100"
            },
            {
              "id": 907,
              "code": "321183",
              "name": "句容市",
              "areacode": "321100"
            }
          ]
        },
        {
          "id": 88,
          "code": "321200",
          "name": "泰州市",
          "citycode": "320000",
          "district": [
            {
              "id": 908,
              "code": "321201",
              "name": "市辖区",
              "areacode": "321200"
            },
            {
              "id": 909,
              "code": "321202",
              "name": "海陵区",
              "areacode": "321200"
            },
            {
              "id": 910,
              "code": "321203",
              "name": "高港区",
              "areacode": "321200"
            },
            {
              "id": 911,
              "code": "321281",
              "name": "兴化市",
              "areacode": "321200"
            },
            {
              "id": 912,
              "code": "321282",
              "name": "靖江市",
              "areacode": "321200"
            },
            {
              "id": 913,
              "code": "321283",
              "name": "泰兴市",
              "areacode": "321200"
            },
            {
              "id": 914,
              "code": "321284",
              "name": "姜堰市",
              "areacode": "321200"
            }
          ]
        },
        {
          "id": 89,
          "code": "321300",
          "name": "宿迁市",
          "citycode": "320000",
          "district": [
            {
              "id": 915,
              "code": "321301",
              "name": "市辖区",
              "areacode": "321300"
            },
            {
              "id": 916,
              "code": "321302",
              "name": "宿城区",
              "areacode": "321300"
            },
            {
              "id": 917,
              "code": "321311",
              "name": "宿豫区",
              "areacode": "321300"
            },
            {
              "id": 918,
              "code": "321322",
              "name": "沭阳县",
              "areacode": "321300"
            },
            {
              "id": 919,
              "code": "321323",
              "name": "泗阳县",
              "areacode": "321300"
            },
            {
              "id": 920,
              "code": "321324",
              "name": "泗洪县",
              "areacode": "321300"
            }
          ]
        }
      ]
    },
    {
      "id": 11,
      "code": "330000",
      "name": "浙江省",
      "city": [
        {
          "id": 90,
          "code": "330100",
          "name": "杭州市",
          "citycode": "330000",
          "district": [
            {
              "id": 921,
              "code": "330101",
              "name": "市辖区",
              "areacode": "330100"
            },
            {
              "id": 922,
              "code": "330102",
              "name": "上城区",
              "areacode": "330100"
            },
            {
              "id": 923,
              "code": "330103",
              "name": "下城区",
              "areacode": "330100"
            },
            {
              "id": 924,
              "code": "330104",
              "name": "江干区",
              "areacode": "330100"
            },
            {
              "id": 925,
              "code": "330105",
              "name": "拱墅区",
              "areacode": "330100"
            },
            {
              "id": 926,
              "code": "330106",
              "name": "西湖区",
              "areacode": "330100"
            },
            {
              "id": 927,
              "code": "330108",
              "name": "滨江区",
              "areacode": "330100"
            },
            {
              "id": 928,
              "code": "330109",
              "name": "萧山区",
              "areacode": "330100"
            },
            {
              "id": 929,
              "code": "330110",
              "name": "余杭区",
              "areacode": "330100"
            },
            {
              "id": 930,
              "code": "330122",
              "name": "桐庐县",
              "areacode": "330100"
            },
            {
              "id": 931,
              "code": "330127",
              "name": "淳安县",
              "areacode": "330100"
            },
            {
              "id": 932,
              "code": "330182",
              "name": "建德市",
              "areacode": "330100"
            },
            {
              "id": 933,
              "code": "330183",
              "name": "富阳市",
              "areacode": "330100"
            },
            {
              "id": 934,
              "code": "330185",
              "name": "临安市",
              "areacode": "330100"
            }
          ]
        },
        {
          "id": 91,
          "code": "330200",
          "name": "宁波市",
          "citycode": "330000",
          "district": [
            {
              "id": 935,
              "code": "330201",
              "name": "市辖区",
              "areacode": "330200"
            },
            {
              "id": 936,
              "code": "330203",
              "name": "海曙区",
              "areacode": "330200"
            },
            {
              "id": 937,
              "code": "330204",
              "name": "江东区",
              "areacode": "330200"
            },
            {
              "id": 938,
              "code": "330205",
              "name": "江北区",
              "areacode": "330200"
            },
            {
              "id": 939,
              "code": "330206",
              "name": "北仑区",
              "areacode": "330200"
            },
            {
              "id": 940,
              "code": "330211",
              "name": "镇海区",
              "areacode": "330200"
            },
            {
              "id": 941,
              "code": "330212",
              "name": "鄞州区",
              "areacode": "330200"
            },
            {
              "id": 942,
              "code": "330225",
              "name": "象山县",
              "areacode": "330200"
            },
            {
              "id": 943,
              "code": "330226",
              "name": "宁海县",
              "areacode": "330200"
            },
            {
              "id": 944,
              "code": "330281",
              "name": "余姚市",
              "areacode": "330200"
            },
            {
              "id": 945,
              "code": "330282",
              "name": "慈溪市",
              "areacode": "330200"
            },
            {
              "id": 946,
              "code": "330283",
              "name": "奉化市",
              "areacode": "330200"
            }
          ]
        },
        {
          "id": 92,
          "code": "330300",
          "name": "温州市",
          "citycode": "330000",
          "district": [
            {
              "id": 947,
              "code": "330301",
              "name": "市辖区",
              "areacode": "330300"
            },
            {
              "id": 948,
              "code": "330302",
              "name": "鹿城区",
              "areacode": "330300"
            },
            {
              "id": 949,
              "code": "330303",
              "name": "龙湾区",
              "areacode": "330300"
            },
            {
              "id": 950,
              "code": "330304",
              "name": "瓯海区",
              "areacode": "330300"
            },
            {
              "id": 951,
              "code": "330322",
              "name": "洞头县",
              "areacode": "330300"
            },
            {
              "id": 952,
              "code": "330324",
              "name": "永嘉县",
              "areacode": "330300"
            },
            {
              "id": 953,
              "code": "330326",
              "name": "平阳县",
              "areacode": "330300"
            },
            {
              "id": 954,
              "code": "330327",
              "name": "苍南县",
              "areacode": "330300"
            },
            {
              "id": 955,
              "code": "330328",
              "name": "文成县",
              "areacode": "330300"
            },
            {
              "id": 956,
              "code": "330329",
              "name": "泰顺县",
              "areacode": "330300"
            },
            {
              "id": 957,
              "code": "330381",
              "name": "瑞安市",
              "areacode": "330300"
            },
            {
              "id": 958,
              "code": "330382",
              "name": "乐清市",
              "areacode": "330300"
            }
          ]
        },
        {
          "id": 93,
          "code": "330400",
          "name": "嘉兴市",
          "citycode": "330000",
          "district": [
            {
              "id": 959,
              "code": "330401",
              "name": "市辖区",
              "areacode": "330400"
            },
            {
              "id": 960,
              "code": "330402",
              "name": "秀城区",
              "areacode": "330400"
            },
            {
              "id": 961,
              "code": "330411",
              "name": "秀洲区",
              "areacode": "330400"
            },
            {
              "id": 962,
              "code": "330421",
              "name": "嘉善县",
              "areacode": "330400"
            },
            {
              "id": 963,
              "code": "330424",
              "name": "海盐县",
              "areacode": "330400"
            },
            {
              "id": 964,
              "code": "330481",
              "name": "海宁市",
              "areacode": "330400"
            },
            {
              "id": 965,
              "code": "330482",
              "name": "平湖市",
              "areacode": "330400"
            },
            {
              "id": 966,
              "code": "330483",
              "name": "桐乡市",
              "areacode": "330400"
            }
          ]
        },
        {
          "id": 94,
          "code": "330500",
          "name": "湖州市",
          "citycode": "330000",
          "district": [
            {
              "id": 967,
              "code": "330501",
              "name": "市辖区",
              "areacode": "330500"
            },
            {
              "id": 968,
              "code": "330502",
              "name": "吴兴区",
              "areacode": "330500"
            },
            {
              "id": 969,
              "code": "330503",
              "name": "南浔区",
              "areacode": "330500"
            },
            {
              "id": 970,
              "code": "330521",
              "name": "德清县",
              "areacode": "330500"
            },
            {
              "id": 971,
              "code": "330522",
              "name": "长兴县",
              "areacode": "330500"
            },
            {
              "id": 972,
              "code": "330523",
              "name": "安吉县",
              "areacode": "330500"
            }
          ]
        },
        {
          "id": 95,
          "code": "330600",
          "name": "绍兴市",
          "citycode": "330000",
          "district": [
            {
              "id": 973,
              "code": "330601",
              "name": "市辖区",
              "areacode": "330600"
            },
            {
              "id": 974,
              "code": "330602",
              "name": "越城区",
              "areacode": "330600"
            },
            {
              "id": 975,
              "code": "330621",
              "name": "绍兴县",
              "areacode": "330600"
            },
            {
              "id": 976,
              "code": "330624",
              "name": "新昌县",
              "areacode": "330600"
            },
            {
              "id": 977,
              "code": "330681",
              "name": "诸暨市",
              "areacode": "330600"
            },
            {
              "id": 978,
              "code": "330682",
              "name": "上虞市",
              "areacode": "330600"
            },
            {
              "id": 979,
              "code": "330683",
              "name": "嵊州市",
              "areacode": "330600"
            }
          ]
        },
        {
          "id": 96,
          "code": "330700",
          "name": "金华市",
          "citycode": "330000",
          "district": [
            {
              "id": 980,
              "code": "330701",
              "name": "市辖区",
              "areacode": "330700"
            },
            {
              "id": 981,
              "code": "330702",
              "name": "婺城区",
              "areacode": "330700"
            },
            {
              "id": 982,
              "code": "330703",
              "name": "金东区",
              "areacode": "330700"
            },
            {
              "id": 983,
              "code": "330723",
              "name": "武义县",
              "areacode": "330700"
            },
            {
              "id": 984,
              "code": "330726",
              "name": "浦江县",
              "areacode": "330700"
            },
            {
              "id": 985,
              "code": "330727",
              "name": "磐安县",
              "areacode": "330700"
            },
            {
              "id": 986,
              "code": "330781",
              "name": "兰溪市",
              "areacode": "330700"
            },
            {
              "id": 987,
              "code": "330782",
              "name": "义乌市",
              "areacode": "330700"
            },
            {
              "id": 988,
              "code": "330783",
              "name": "东阳市",
              "areacode": "330700"
            },
            {
              "id": 989,
              "code": "330784",
              "name": "永康市",
              "areacode": "330700"
            }
          ]
        },
        {
          "id": 97,
          "code": "330800",
          "name": "衢州市",
          "citycode": "330000",
          "district": [
            {
              "id": 990,
              "code": "330801",
              "name": "市辖区",
              "areacode": "330800"
            },
            {
              "id": 991,
              "code": "330802",
              "name": "柯城区",
              "areacode": "330800"
            },
            {
              "id": 992,
              "code": "330803",
              "name": "衢江区",
              "areacode": "330800"
            },
            {
              "id": 993,
              "code": "330822",
              "name": "常山县",
              "areacode": "330800"
            },
            {
              "id": 994,
              "code": "330824",
              "name": "开化县",
              "areacode": "330800"
            },
            {
              "id": 995,
              "code": "330825",
              "name": "龙游县",
              "areacode": "330800"
            },
            {
              "id": 996,
              "code": "330881",
              "name": "江山市",
              "areacode": "330800"
            }
          ]
        },
        {
          "id": 98,
          "code": "330900",
          "name": "舟山市",
          "citycode": "330000",
          "district": [
            {
              "id": 997,
              "code": "330901",
              "name": "市辖区",
              "areacode": "330900"
            },
            {
              "id": 998,
              "code": "330902",
              "name": "定海区",
              "areacode": "330900"
            },
            {
              "id": 999,
              "code": "330903",
              "name": "普陀区",
              "areacode": "330900"
            },
            {
              "id": 1000,
              "code": "330921",
              "name": "岱山县",
              "areacode": "330900"
            },
            {
              "id": 1001,
              "code": "330922",
              "name": "嵊泗县",
              "areacode": "330900"
            }
          ]
        },
        {
          "id": 99,
          "code": "331000",
          "name": "台州市",
          "citycode": "330000",
          "district": [
            {
              "id": 1002,
              "code": "331001",
              "name": "市辖区",
              "areacode": "331000"
            },
            {
              "id": 1003,
              "code": "331002",
              "name": "椒江区",
              "areacode": "331000"
            },
            {
              "id": 1004,
              "code": "331003",
              "name": "黄岩区",
              "areacode": "331000"
            },
            {
              "id": 1005,
              "code": "331004",
              "name": "路桥区",
              "areacode": "331000"
            },
            {
              "id": 1006,
              "code": "331021",
              "name": "玉环县",
              "areacode": "331000"
            },
            {
              "id": 1007,
              "code": "331022",
              "name": "三门县",
              "areacode": "331000"
            },
            {
              "id": 1008,
              "code": "331023",
              "name": "天台县",
              "areacode": "331000"
            },
            {
              "id": 1009,
              "code": "331024",
              "name": "仙居县",
              "areacode": "331000"
            },
            {
              "id": 1010,
              "code": "331081",
              "name": "温岭市",
              "areacode": "331000"
            },
            {
              "id": 1011,
              "code": "331082",
              "name": "临海市",
              "areacode": "331000"
            }
          ]
        },
        {
          "id": 100,
          "code": "331100",
          "name": "丽水市",
          "citycode": "330000",
          "district": [
            {
              "id": 1012,
              "code": "331101",
              "name": "市辖区",
              "areacode": "331100"
            },
            {
              "id": 1013,
              "code": "331102",
              "name": "莲都区",
              "areacode": "331100"
            },
            {
              "id": 1014,
              "code": "331121",
              "name": "青田县",
              "areacode": "331100"
            },
            {
              "id": 1015,
              "code": "331122",
              "name": "缙云县",
              "areacode": "331100"
            },
            {
              "id": 1016,
              "code": "331123",
              "name": "遂昌县",
              "areacode": "331100"
            },
            {
              "id": 1017,
              "code": "331124",
              "name": "松阳县",
              "areacode": "331100"
            },
            {
              "id": 1018,
              "code": "331125",
              "name": "云和县",
              "areacode": "331100"
            },
            {
              "id": 1019,
              "code": "331126",
              "name": "庆元县",
              "areacode": "331100"
            },
            {
              "id": 1020,
              "code": "331127",
              "name": "景宁畲族自治县",
              "areacode": "331100"
            },
            {
              "id": 1021,
              "code": "331181",
              "name": "龙泉市",
              "areacode": "331100"
            }
          ]
        }
      ]
    },
    {
      "id": 12,
      "code": "340000",
      "name": "安徽省",
      "city": [
        {
          "id": 101,
          "code": "340100",
          "name": "合肥市",
          "citycode": "340000",
          "district": [
            {
              "id": 1022,
              "code": "340101",
              "name": "市辖区",
              "areacode": "340100"
            },
            {
              "id": 1023,
              "code": "340102",
              "name": "瑶海区",
              "areacode": "340100"
            },
            {
              "id": 1024,
              "code": "340103",
              "name": "庐阳区",
              "areacode": "340100"
            },
            {
              "id": 1025,
              "code": "340104",
              "name": "蜀山区",
              "areacode": "340100"
            },
            {
              "id": 1026,
              "code": "340111",
              "name": "包河区",
              "areacode": "340100"
            },
            {
              "id": 1027,
              "code": "340121",
              "name": "长丰县",
              "areacode": "340100"
            },
            {
              "id": 1028,
              "code": "340122",
              "name": "肥东县",
              "areacode": "340100"
            },
            {
              "id": 1029,
              "code": "340123",
              "name": "肥西县",
              "areacode": "340100"
            }
          ]
        },
        {
          "id": 102,
          "code": "340200",
          "name": "芜湖市",
          "citycode": "340000",
          "district": [
            {
              "id": 1030,
              "code": "340201",
              "name": "市辖区",
              "areacode": "340200"
            },
            {
              "id": 1031,
              "code": "340202",
              "name": "镜湖区",
              "areacode": "340200"
            },
            {
              "id": 1032,
              "code": "340203",
              "name": "马塘区",
              "areacode": "340200"
            },
            {
              "id": 1033,
              "code": "340204",
              "name": "新芜区",
              "areacode": "340200"
            },
            {
              "id": 1034,
              "code": "340207",
              "name": "鸠江区",
              "areacode": "340200"
            },
            {
              "id": 1035,
              "code": "340221",
              "name": "芜湖县",
              "areacode": "340200"
            },
            {
              "id": 1036,
              "code": "340222",
              "name": "繁昌县",
              "areacode": "340200"
            },
            {
              "id": 1037,
              "code": "340223",
              "name": "南陵县",
              "areacode": "340200"
            }
          ]
        },
        {
          "id": 103,
          "code": "340300",
          "name": "蚌埠市",
          "citycode": "340000",
          "district": [
            {
              "id": 1038,
              "code": "340301",
              "name": "市辖区",
              "areacode": "340300"
            },
            {
              "id": 1039,
              "code": "340302",
              "name": "龙子湖区",
              "areacode": "340300"
            },
            {
              "id": 1040,
              "code": "340303",
              "name": "蚌山区",
              "areacode": "340300"
            },
            {
              "id": 1041,
              "code": "340304",
              "name": "禹会区",
              "areacode": "340300"
            },
            {
              "id": 1042,
              "code": "340311",
              "name": "淮上区",
              "areacode": "340300"
            },
            {
              "id": 1043,
              "code": "340321",
              "name": "怀远县",
              "areacode": "340300"
            },
            {
              "id": 1044,
              "code": "340322",
              "name": "五河县",
              "areacode": "340300"
            },
            {
              "id": 1045,
              "code": "340323",
              "name": "固镇县",
              "areacode": "340300"
            }
          ]
        },
        {
          "id": 104,
          "code": "340400",
          "name": "淮南市",
          "citycode": "340000",
          "district": [
            {
              "id": 1046,
              "code": "340401",
              "name": "市辖区",
              "areacode": "340400"
            },
            {
              "id": 1047,
              "code": "340402",
              "name": "大通区",
              "areacode": "340400"
            },
            {
              "id": 1048,
              "code": "340403",
              "name": "田家庵区",
              "areacode": "340400"
            },
            {
              "id": 1049,
              "code": "340404",
              "name": "谢家集区",
              "areacode": "340400"
            },
            {
              "id": 1050,
              "code": "340405",
              "name": "八公山区",
              "areacode": "340400"
            },
            {
              "id": 1051,
              "code": "340406",
              "name": "潘集区",
              "areacode": "340400"
            },
            {
              "id": 1052,
              "code": "340421",
              "name": "凤台县",
              "areacode": "340400"
            }
          ]
        },
        {
          "id": 105,
          "code": "340500",
          "name": "马鞍山市",
          "citycode": "340000",
          "district": [
            {
              "id": 1053,
              "code": "340501",
              "name": "市辖区",
              "areacode": "340500"
            },
            {
              "id": 1054,
              "code": "340502",
              "name": "金家庄区",
              "areacode": "340500"
            },
            {
              "id": 1055,
              "code": "340503",
              "name": "花山区",
              "areacode": "340500"
            },
            {
              "id": 1056,
              "code": "340504",
              "name": "雨山区",
              "areacode": "340500"
            },
            {
              "id": 1057,
              "code": "340521",
              "name": "当涂县",
              "areacode": "340500"
            }
          ]
        },
        {
          "id": 106,
          "code": "340600",
          "name": "淮北市",
          "citycode": "340000",
          "district": [
            {
              "id": 1058,
              "code": "340601",
              "name": "市辖区",
              "areacode": "340600"
            },
            {
              "id": 1059,
              "code": "340602",
              "name": "杜集区",
              "areacode": "340600"
            },
            {
              "id": 1060,
              "code": "340603",
              "name": "相山区",
              "areacode": "340600"
            },
            {
              "id": 1061,
              "code": "340604",
              "name": "烈山区",
              "areacode": "340600"
            },
            {
              "id": 1062,
              "code": "340621",
              "name": "濉溪县",
              "areacode": "340600"
            }
          ]
        },
        {
          "id": 107,
          "code": "340700",
          "name": "铜陵市",
          "citycode": "340000",
          "district": [
            {
              "id": 1063,
              "code": "340701",
              "name": "市辖区",
              "areacode": "340700"
            },
            {
              "id": 1064,
              "code": "340702",
              "name": "铜官山区",
              "areacode": "340700"
            },
            {
              "id": 1065,
              "code": "340703",
              "name": "狮子山区",
              "areacode": "340700"
            },
            {
              "id": 1066,
              "code": "340711",
              "name": "郊　区",
              "areacode": "340700"
            },
            {
              "id": 1067,
              "code": "340721",
              "name": "铜陵县",
              "areacode": "340700"
            }
          ]
        },
        {
          "id": 108,
          "code": "340800",
          "name": "安庆市",
          "citycode": "340000",
          "district": [
            {
              "id": 1068,
              "code": "340801",
              "name": "市辖区",
              "areacode": "340800"
            },
            {
              "id": 1069,
              "code": "340802",
              "name": "迎江区",
              "areacode": "340800"
            },
            {
              "id": 1070,
              "code": "340803",
              "name": "大观区",
              "areacode": "340800"
            },
            {
              "id": 1071,
              "code": "340811",
              "name": "郊　区",
              "areacode": "340800"
            },
            {
              "id": 1072,
              "code": "340822",
              "name": "怀宁县",
              "areacode": "340800"
            },
            {
              "id": 1073,
              "code": "340823",
              "name": "枞阳县",
              "areacode": "340800"
            },
            {
              "id": 1074,
              "code": "340824",
              "name": "潜山县",
              "areacode": "340800"
            },
            {
              "id": 1075,
              "code": "340825",
              "name": "太湖县",
              "areacode": "340800"
            },
            {
              "id": 1076,
              "code": "340826",
              "name": "宿松县",
              "areacode": "340800"
            },
            {
              "id": 1077,
              "code": "340827",
              "name": "望江县",
              "areacode": "340800"
            },
            {
              "id": 1078,
              "code": "340828",
              "name": "岳西县",
              "areacode": "340800"
            },
            {
              "id": 1079,
              "code": "340881",
              "name": "桐城市",
              "areacode": "340800"
            }
          ]
        },
        {
          "id": 109,
          "code": "341000",
          "name": "黄山市",
          "citycode": "340000",
          "district": [
            {
              "id": 1080,
              "code": "341001",
              "name": "市辖区",
              "areacode": "341000"
            },
            {
              "id": 1081,
              "code": "341002",
              "name": "屯溪区",
              "areacode": "341000"
            },
            {
              "id": 1082,
              "code": "341003",
              "name": "黄山区",
              "areacode": "341000"
            },
            {
              "id": 1083,
              "code": "341004",
              "name": "徽州区",
              "areacode": "341000"
            },
            {
              "id": 1084,
              "code": "341021",
              "name": "歙　县",
              "areacode": "341000"
            },
            {
              "id": 1085,
              "code": "341022",
              "name": "休宁县",
              "areacode": "341000"
            },
            {
              "id": 1086,
              "code": "341023",
              "name": "黟　县",
              "areacode": "341000"
            },
            {
              "id": 1087,
              "code": "341024",
              "name": "祁门县",
              "areacode": "341000"
            }
          ]
        },
        {
          "id": 110,
          "code": "341100",
          "name": "滁州市",
          "citycode": "340000",
          "district": [
            {
              "id": 1088,
              "code": "341101",
              "name": "市辖区",
              "areacode": "341100"
            },
            {
              "id": 1089,
              "code": "341102",
              "name": "琅琊区",
              "areacode": "341100"
            },
            {
              "id": 1090,
              "code": "341103",
              "name": "南谯区",
              "areacode": "341100"
            },
            {
              "id": 1091,
              "code": "341122",
              "name": "来安县",
              "areacode": "341100"
            },
            {
              "id": 1092,
              "code": "341124",
              "name": "全椒县",
              "areacode": "341100"
            },
            {
              "id": 1093,
              "code": "341125",
              "name": "定远县",
              "areacode": "341100"
            },
            {
              "id": 1094,
              "code": "341126",
              "name": "凤阳县",
              "areacode": "341100"
            },
            {
              "id": 1095,
              "code": "341181",
              "name": "天长市",
              "areacode": "341100"
            },
            {
              "id": 1096,
              "code": "341182",
              "name": "明光市",
              "areacode": "341100"
            }
          ]
        },
        {
          "id": 111,
          "code": "341200",
          "name": "阜阳市",
          "citycode": "340000",
          "district": [
            {
              "id": 1097,
              "code": "341201",
              "name": "市辖区",
              "areacode": "341200"
            },
            {
              "id": 1098,
              "code": "341202",
              "name": "颍州区",
              "areacode": "341200"
            },
            {
              "id": 1099,
              "code": "341203",
              "name": "颍东区",
              "areacode": "341200"
            },
            {
              "id": 1100,
              "code": "341204",
              "name": "颍泉区",
              "areacode": "341200"
            },
            {
              "id": 1101,
              "code": "341221",
              "name": "临泉县",
              "areacode": "341200"
            },
            {
              "id": 1102,
              "code": "341222",
              "name": "太和县",
              "areacode": "341200"
            },
            {
              "id": 1103,
              "code": "341225",
              "name": "阜南县",
              "areacode": "341200"
            },
            {
              "id": 1104,
              "code": "341226",
              "name": "颍上县",
              "areacode": "341200"
            },
            {
              "id": 1105,
              "code": "341282",
              "name": "界首市",
              "areacode": "341200"
            }
          ]
        },
        {
          "id": 112,
          "code": "341300",
          "name": "宿州市",
          "citycode": "340000",
          "district": [
            {
              "id": 1106,
              "code": "341301",
              "name": "市辖区",
              "areacode": "341300"
            },
            {
              "id": 1107,
              "code": "341302",
              "name": "墉桥区",
              "areacode": "341300"
            },
            {
              "id": 1108,
              "code": "341321",
              "name": "砀山县",
              "areacode": "341300"
            },
            {
              "id": 1109,
              "code": "341322",
              "name": "萧　县",
              "areacode": "341300"
            },
            {
              "id": 1110,
              "code": "341323",
              "name": "灵璧县",
              "areacode": "341300"
            },
            {
              "id": 1111,
              "code": "341324",
              "name": "泗　县",
              "areacode": "341300"
            }
          ]
        },
        {
          "id": 113,
          "code": "341400",
          "name": "巢湖市",
          "citycode": "340000",
          "district": [
            {
              "id": 1112,
              "code": "341401",
              "name": "市辖区",
              "areacode": "341400"
            },
            {
              "id": 1113,
              "code": "341402",
              "name": "居巢区",
              "areacode": "341400"
            },
            {
              "id": 1114,
              "code": "341421",
              "name": "庐江县",
              "areacode": "341400"
            },
            {
              "id": 1115,
              "code": "341422",
              "name": "无为县",
              "areacode": "341400"
            },
            {
              "id": 1116,
              "code": "341423",
              "name": "含山县",
              "areacode": "341400"
            },
            {
              "id": 1117,
              "code": "341424",
              "name": "和　县",
              "areacode": "341400"
            }
          ]
        },
        {
          "id": 114,
          "code": "341500",
          "name": "六安市",
          "citycode": "340000",
          "district": [
            {
              "id": 1118,
              "code": "341501",
              "name": "市辖区",
              "areacode": "341500"
            },
            {
              "id": 1119,
              "code": "341502",
              "name": "金安区",
              "areacode": "341500"
            },
            {
              "id": 1120,
              "code": "341503",
              "name": "裕安区",
              "areacode": "341500"
            },
            {
              "id": 1121,
              "code": "341521",
              "name": "寿　县",
              "areacode": "341500"
            },
            {
              "id": 1122,
              "code": "341522",
              "name": "霍邱县",
              "areacode": "341500"
            },
            {
              "id": 1123,
              "code": "341523",
              "name": "舒城县",
              "areacode": "341500"
            },
            {
              "id": 1124,
              "code": "341524",
              "name": "金寨县",
              "areacode": "341500"
            },
            {
              "id": 1125,
              "code": "341525",
              "name": "霍山县",
              "areacode": "341500"
            }
          ]
        },
        {
          "id": 115,
          "code": "341600",
          "name": "亳州市",
          "citycode": "340000",
          "district": [
            {
              "id": 1126,
              "code": "341601",
              "name": "市辖区",
              "areacode": "341600"
            },
            {
              "id": 1127,
              "code": "341602",
              "name": "谯城区",
              "areacode": "341600"
            },
            {
              "id": 1128,
              "code": "341621",
              "name": "涡阳县",
              "areacode": "341600"
            },
            {
              "id": 1129,
              "code": "341622",
              "name": "蒙城县",
              "areacode": "341600"
            },
            {
              "id": 1130,
              "code": "341623",
              "name": "利辛县",
              "areacode": "341600"
            }
          ]
        },
        {
          "id": 116,
          "code": "341700",
          "name": "池州市",
          "citycode": "340000",
          "district": [
            {
              "id": 1131,
              "code": "341701",
              "name": "市辖区",
              "areacode": "341700"
            },
            {
              "id": 1132,
              "code": "341702",
              "name": "贵池区",
              "areacode": "341700"
            },
            {
              "id": 1133,
              "code": "341721",
              "name": "东至县",
              "areacode": "341700"
            },
            {
              "id": 1134,
              "code": "341722",
              "name": "石台县",
              "areacode": "341700"
            },
            {
              "id": 1135,
              "code": "341723",
              "name": "青阳县",
              "areacode": "341700"
            }
          ]
        },
        {
          "id": 117,
          "code": "341800",
          "name": "宣城市",
          "citycode": "340000",
          "district": [
            {
              "id": 1136,
              "code": "341801",
              "name": "市辖区",
              "areacode": "341800"
            },
            {
              "id": 1137,
              "code": "341802",
              "name": "宣州区",
              "areacode": "341800"
            },
            {
              "id": 1138,
              "code": "341821",
              "name": "郎溪县",
              "areacode": "341800"
            },
            {
              "id": 1139,
              "code": "341822",
              "name": "广德县",
              "areacode": "341800"
            },
            {
              "id": 1140,
              "code": "341823",
              "name": "泾　县",
              "areacode": "341800"
            },
            {
              "id": 1141,
              "code": "341824",
              "name": "绩溪县",
              "areacode": "341800"
            },
            {
              "id": 1142,
              "code": "341825",
              "name": "旌德县",
              "areacode": "341800"
            },
            {
              "id": 1143,
              "code": "341881",
              "name": "宁国市",
              "areacode": "341800"
            }
          ]
        }
      ]
    },
    {
      "id": 13,
      "code": "350000",
      "name": "福建省",
      "city": [
        {
          "id": 118,
          "code": "350100",
          "name": "福州市",
          "citycode": "350000",
          "district": [
            {
              "id": 1144,
              "code": "350101",
              "name": "市辖区",
              "areacode": "350100"
            },
            {
              "id": 1145,
              "code": "350102",
              "name": "鼓楼区",
              "areacode": "350100"
            },
            {
              "id": 1146,
              "code": "350103",
              "name": "台江区",
              "areacode": "350100"
            },
            {
              "id": 1147,
              "code": "350104",
              "name": "仓山区",
              "areacode": "350100"
            },
            {
              "id": 1148,
              "code": "350105",
              "name": "马尾区",
              "areacode": "350100"
            },
            {
              "id": 1149,
              "code": "350111",
              "name": "晋安区",
              "areacode": "350100"
            },
            {
              "id": 1150,
              "code": "350121",
              "name": "闽侯县",
              "areacode": "350100"
            },
            {
              "id": 1151,
              "code": "350122",
              "name": "连江县",
              "areacode": "350100"
            },
            {
              "id": 1152,
              "code": "350123",
              "name": "罗源县",
              "areacode": "350100"
            },
            {
              "id": 1153,
              "code": "350124",
              "name": "闽清县",
              "areacode": "350100"
            },
            {
              "id": 1154,
              "code": "350125",
              "name": "永泰县",
              "areacode": "350100"
            },
            {
              "id": 1155,
              "code": "350128",
              "name": "平潭县",
              "areacode": "350100"
            },
            {
              "id": 1156,
              "code": "350181",
              "name": "福清市",
              "areacode": "350100"
            },
            {
              "id": 1157,
              "code": "350182",
              "name": "长乐市",
              "areacode": "350100"
            }
          ]
        },
        {
          "id": 119,
          "code": "350200",
          "name": "厦门市",
          "citycode": "350000",
          "district": [
            {
              "id": 1158,
              "code": "350201",
              "name": "市辖区",
              "areacode": "350200"
            },
            {
              "id": 1159,
              "code": "350203",
              "name": "思明区",
              "areacode": "350200"
            },
            {
              "id": 1160,
              "code": "350205",
              "name": "海沧区",
              "areacode": "350200"
            },
            {
              "id": 1161,
              "code": "350206",
              "name": "湖里区",
              "areacode": "350200"
            },
            {
              "id": 1162,
              "code": "350211",
              "name": "集美区",
              "areacode": "350200"
            },
            {
              "id": 1163,
              "code": "350212",
              "name": "同安区",
              "areacode": "350200"
            },
            {
              "id": 1164,
              "code": "350213",
              "name": "翔安区",
              "areacode": "350200"
            }
          ]
        },
        {
          "id": 120,
          "code": "350300",
          "name": "莆田市",
          "citycode": "350000",
          "district": [
            {
              "id": 1165,
              "code": "350301",
              "name": "市辖区",
              "areacode": "350300"
            },
            {
              "id": 1166,
              "code": "350302",
              "name": "城厢区",
              "areacode": "350300"
            },
            {
              "id": 1167,
              "code": "350303",
              "name": "涵江区",
              "areacode": "350300"
            },
            {
              "id": 1168,
              "code": "350304",
              "name": "荔城区",
              "areacode": "350300"
            },
            {
              "id": 1169,
              "code": "350305",
              "name": "秀屿区",
              "areacode": "350300"
            },
            {
              "id": 1170,
              "code": "350322",
              "name": "仙游县",
              "areacode": "350300"
            }
          ]
        },
        {
          "id": 121,
          "code": "350400",
          "name": "三明市",
          "citycode": "350000",
          "district": [
            {
              "id": 1171,
              "code": "350401",
              "name": "市辖区",
              "areacode": "350400"
            },
            {
              "id": 1172,
              "code": "350402",
              "name": "梅列区",
              "areacode": "350400"
            },
            {
              "id": 1173,
              "code": "350403",
              "name": "三元区",
              "areacode": "350400"
            },
            {
              "id": 1174,
              "code": "350421",
              "name": "明溪县",
              "areacode": "350400"
            },
            {
              "id": 1175,
              "code": "350423",
              "name": "清流县",
              "areacode": "350400"
            },
            {
              "id": 1176,
              "code": "350424",
              "name": "宁化县",
              "areacode": "350400"
            },
            {
              "id": 1177,
              "code": "350425",
              "name": "大田县",
              "areacode": "350400"
            },
            {
              "id": 1178,
              "code": "350426",
              "name": "尤溪县",
              "areacode": "350400"
            },
            {
              "id": 1179,
              "code": "350427",
              "name": "沙　县",
              "areacode": "350400"
            },
            {
              "id": 1180,
              "code": "350428",
              "name": "将乐县",
              "areacode": "350400"
            },
            {
              "id": 1181,
              "code": "350429",
              "name": "泰宁县",
              "areacode": "350400"
            },
            {
              "id": 1182,
              "code": "350430",
              "name": "建宁县",
              "areacode": "350400"
            },
            {
              "id": 1183,
              "code": "350481",
              "name": "永安市",
              "areacode": "350400"
            }
          ]
        },
        {
          "id": 122,
          "code": "350500",
          "name": "泉州市",
          "citycode": "350000",
          "district": [
            {
              "id": 1184,
              "code": "350501",
              "name": "市辖区",
              "areacode": "350500"
            },
            {
              "id": 1185,
              "code": "350502",
              "name": "鲤城区",
              "areacode": "350500"
            },
            {
              "id": 1186,
              "code": "350503",
              "name": "丰泽区",
              "areacode": "350500"
            },
            {
              "id": 1187,
              "code": "350504",
              "name": "洛江区",
              "areacode": "350500"
            },
            {
              "id": 1188,
              "code": "350505",
              "name": "泉港区",
              "areacode": "350500"
            },
            {
              "id": 1189,
              "code": "350521",
              "name": "惠安县",
              "areacode": "350500"
            },
            {
              "id": 1190,
              "code": "350524",
              "name": "安溪县",
              "areacode": "350500"
            },
            {
              "id": 1191,
              "code": "350525",
              "name": "永春县",
              "areacode": "350500"
            },
            {
              "id": 1192,
              "code": "350526",
              "name": "德化县",
              "areacode": "350500"
            },
            {
              "id": 1193,
              "code": "350527",
              "name": "金门县",
              "areacode": "350500"
            },
            {
              "id": 1194,
              "code": "350581",
              "name": "石狮市",
              "areacode": "350500"
            },
            {
              "id": 1195,
              "code": "350582",
              "name": "晋江市",
              "areacode": "350500"
            },
            {
              "id": 1196,
              "code": "350583",
              "name": "南安市",
              "areacode": "350500"
            }
          ]
        },
        {
          "id": 123,
          "code": "350600",
          "name": "漳州市",
          "citycode": "350000",
          "district": [
            {
              "id": 1197,
              "code": "350601",
              "name": "市辖区",
              "areacode": "350600"
            },
            {
              "id": 1198,
              "code": "350602",
              "name": "芗城区",
              "areacode": "350600"
            },
            {
              "id": 1199,
              "code": "350603",
              "name": "龙文区",
              "areacode": "350600"
            },
            {
              "id": 1200,
              "code": "350622",
              "name": "云霄县",
              "areacode": "350600"
            },
            {
              "id": 1201,
              "code": "350623",
              "name": "漳浦县",
              "areacode": "350600"
            },
            {
              "id": 1202,
              "code": "350624",
              "name": "诏安县",
              "areacode": "350600"
            },
            {
              "id": 1203,
              "code": "350625",
              "name": "长泰县",
              "areacode": "350600"
            },
            {
              "id": 1204,
              "code": "350626",
              "name": "东山县",
              "areacode": "350600"
            },
            {
              "id": 1205,
              "code": "350627",
              "name": "南靖县",
              "areacode": "350600"
            },
            {
              "id": 1206,
              "code": "350628",
              "name": "平和县",
              "areacode": "350600"
            },
            {
              "id": 1207,
              "code": "350629",
              "name": "华安县",
              "areacode": "350600"
            },
            {
              "id": 1208,
              "code": "350681",
              "name": "龙海市",
              "areacode": "350600"
            }
          ]
        },
        {
          "id": 124,
          "code": "350700",
          "name": "南平市",
          "citycode": "350000",
          "district": [
            {
              "id": 1209,
              "code": "350701",
              "name": "市辖区",
              "areacode": "350700"
            },
            {
              "id": 1210,
              "code": "350702",
              "name": "延平区",
              "areacode": "350700"
            },
            {
              "id": 1211,
              "code": "350721",
              "name": "顺昌县",
              "areacode": "350700"
            },
            {
              "id": 1212,
              "code": "350722",
              "name": "浦城县",
              "areacode": "350700"
            },
            {
              "id": 1213,
              "code": "350723",
              "name": "光泽县",
              "areacode": "350700"
            },
            {
              "id": 1214,
              "code": "350724",
              "name": "松溪县",
              "areacode": "350700"
            },
            {
              "id": 1215,
              "code": "350725",
              "name": "政和县",
              "areacode": "350700"
            },
            {
              "id": 1216,
              "code": "350781",
              "name": "邵武市",
              "areacode": "350700"
            },
            {
              "id": 1217,
              "code": "350782",
              "name": "武夷山市",
              "areacode": "350700"
            },
            {
              "id": 1218,
              "code": "350783",
              "name": "建瓯市",
              "areacode": "350700"
            },
            {
              "id": 1219,
              "code": "350784",
              "name": "建阳市",
              "areacode": "350700"
            }
          ]
        },
        {
          "id": 125,
          "code": "350800",
          "name": "龙岩市",
          "citycode": "350000",
          "district": [
            {
              "id": 1220,
              "code": "350801",
              "name": "市辖区",
              "areacode": "350800"
            },
            {
              "id": 1221,
              "code": "350802",
              "name": "新罗区",
              "areacode": "350800"
            },
            {
              "id": 1222,
              "code": "350821",
              "name": "长汀县",
              "areacode": "350800"
            },
            {
              "id": 1223,
              "code": "350822",
              "name": "永定县",
              "areacode": "350800"
            },
            {
              "id": 1224,
              "code": "350823",
              "name": "上杭县",
              "areacode": "350800"
            },
            {
              "id": 1225,
              "code": "350824",
              "name": "武平县",
              "areacode": "350800"
            },
            {
              "id": 1226,
              "code": "350825",
              "name": "连城县",
              "areacode": "350800"
            },
            {
              "id": 1227,
              "code": "350881",
              "name": "漳平市",
              "areacode": "350800"
            }
          ]
        },
        {
          "id": 126,
          "code": "350900",
          "name": "宁德市",
          "citycode": "350000",
          "district": [
            {
              "id": 1228,
              "code": "350901",
              "name": "市辖区",
              "areacode": "350900"
            },
            {
              "id": 1229,
              "code": "350902",
              "name": "蕉城区",
              "areacode": "350900"
            },
            {
              "id": 1230,
              "code": "350921",
              "name": "霞浦县",
              "areacode": "350900"
            },
            {
              "id": 1231,
              "code": "350922",
              "name": "古田县",
              "areacode": "350900"
            },
            {
              "id": 1232,
              "code": "350923",
              "name": "屏南县",
              "areacode": "350900"
            },
            {
              "id": 1233,
              "code": "350924",
              "name": "寿宁县",
              "areacode": "350900"
            },
            {
              "id": 1234,
              "code": "350925",
              "name": "周宁县",
              "areacode": "350900"
            },
            {
              "id": 1235,
              "code": "350926",
              "name": "柘荣县",
              "areacode": "350900"
            },
            {
              "id": 1236,
              "code": "350981",
              "name": "福安市",
              "areacode": "350900"
            },
            {
              "id": 1237,
              "code": "350982",
              "name": "福鼎市",
              "areacode": "350900"
            }
          ]
        }
      ]
    },
    {
      "id": 14,
      "code": "360000",
      "name": "江西省",
      "city": [
        {
          "id": 127,
          "code": "360100",
          "name": "南昌市",
          "citycode": "360000",
          "district": [
            {
              "id": 1238,
              "code": "360101",
              "name": "市辖区",
              "areacode": "360100"
            },
            {
              "id": 1239,
              "code": "360102",
              "name": "东湖区",
              "areacode": "360100"
            },
            {
              "id": 1240,
              "code": "360103",
              "name": "西湖区",
              "areacode": "360100"
            },
            {
              "id": 1241,
              "code": "360104",
              "name": "青云谱区",
              "areacode": "360100"
            },
            {
              "id": 1242,
              "code": "360105",
              "name": "湾里区",
              "areacode": "360100"
            },
            {
              "id": 1243,
              "code": "360111",
              "name": "青山湖区",
              "areacode": "360100"
            },
            {
              "id": 1244,
              "code": "360121",
              "name": "南昌县",
              "areacode": "360100"
            },
            {
              "id": 1245,
              "code": "360122",
              "name": "新建县",
              "areacode": "360100"
            },
            {
              "id": 1246,
              "code": "360123",
              "name": "安义县",
              "areacode": "360100"
            },
            {
              "id": 1247,
              "code": "360124",
              "name": "进贤县",
              "areacode": "360100"
            }
          ]
        },
        {
          "id": 128,
          "code": "360200",
          "name": "景德镇市",
          "citycode": "360000",
          "district": [
            {
              "id": 1248,
              "code": "360201",
              "name": "市辖区",
              "areacode": "360200"
            },
            {
              "id": 1249,
              "code": "360202",
              "name": "昌江区",
              "areacode": "360200"
            },
            {
              "id": 1250,
              "code": "360203",
              "name": "珠山区",
              "areacode": "360200"
            },
            {
              "id": 1251,
              "code": "360222",
              "name": "浮梁县",
              "areacode": "360200"
            },
            {
              "id": 1252,
              "code": "360281",
              "name": "乐平市",
              "areacode": "360200"
            }
          ]
        },
        {
          "id": 129,
          "code": "360300",
          "name": "萍乡市",
          "citycode": "360000",
          "district": [
            {
              "id": 1253,
              "code": "360301",
              "name": "市辖区",
              "areacode": "360300"
            },
            {
              "id": 1254,
              "code": "360302",
              "name": "安源区",
              "areacode": "360300"
            },
            {
              "id": 1255,
              "code": "360313",
              "name": "湘东区",
              "areacode": "360300"
            },
            {
              "id": 1256,
              "code": "360321",
              "name": "莲花县",
              "areacode": "360300"
            },
            {
              "id": 1257,
              "code": "360322",
              "name": "上栗县",
              "areacode": "360300"
            },
            {
              "id": 1258,
              "code": "360323",
              "name": "芦溪县",
              "areacode": "360300"
            }
          ]
        },
        {
          "id": 130,
          "code": "360400",
          "name": "九江市",
          "citycode": "360000",
          "district": [
            {
              "id": 1259,
              "code": "360401",
              "name": "市辖区",
              "areacode": "360400"
            },
            {
              "id": 1260,
              "code": "360402",
              "name": "庐山区",
              "areacode": "360400"
            },
            {
              "id": 1261,
              "code": "360403",
              "name": "浔阳区",
              "areacode": "360400"
            },
            {
              "id": 1262,
              "code": "360421",
              "name": "九江县",
              "areacode": "360400"
            },
            {
              "id": 1263,
              "code": "360423",
              "name": "武宁县",
              "areacode": "360400"
            },
            {
              "id": 1264,
              "code": "360424",
              "name": "修水县",
              "areacode": "360400"
            },
            {
              "id": 1265,
              "code": "360425",
              "name": "永修县",
              "areacode": "360400"
            },
            {
              "id": 1266,
              "code": "360426",
              "name": "德安县",
              "areacode": "360400"
            },
            {
              "id": 1267,
              "code": "360427",
              "name": "星子县",
              "areacode": "360400"
            },
            {
              "id": 1268,
              "code": "360428",
              "name": "都昌县",
              "areacode": "360400"
            },
            {
              "id": 1269,
              "code": "360429",
              "name": "湖口县",
              "areacode": "360400"
            },
            {
              "id": 1270,
              "code": "360430",
              "name": "彭泽县",
              "areacode": "360400"
            },
            {
              "id": 1271,
              "code": "360481",
              "name": "瑞昌市",
              "areacode": "360400"
            }
          ]
        },
        {
          "id": 131,
          "code": "360500",
          "name": "新余市",
          "citycode": "360000",
          "district": [
            {
              "id": 1272,
              "code": "360501",
              "name": "市辖区",
              "areacode": "360500"
            },
            {
              "id": 1273,
              "code": "360502",
              "name": "渝水区",
              "areacode": "360500"
            },
            {
              "id": 1274,
              "code": "360521",
              "name": "分宜县",
              "areacode": "360500"
            }
          ]
        },
        {
          "id": 132,
          "code": "360600",
          "name": "鹰潭市",
          "citycode": "360000",
          "district": [
            {
              "id": 1275,
              "code": "360601",
              "name": "市辖区",
              "areacode": "360600"
            },
            {
              "id": 1276,
              "code": "360602",
              "name": "月湖区",
              "areacode": "360600"
            },
            {
              "id": 1277,
              "code": "360622",
              "name": "余江县",
              "areacode": "360600"
            },
            {
              "id": 1278,
              "code": "360681",
              "name": "贵溪市",
              "areacode": "360600"
            }
          ]
        },
        {
          "id": 133,
          "code": "360700",
          "name": "赣州市",
          "citycode": "360000",
          "district": [
            {
              "id": 1279,
              "code": "360701",
              "name": "市辖区",
              "areacode": "360700"
            },
            {
              "id": 1280,
              "code": "360702",
              "name": "章贡区",
              "areacode": "360700"
            },
            {
              "id": 1281,
              "code": "360721",
              "name": "赣　县",
              "areacode": "360700"
            },
            {
              "id": 1282,
              "code": "360722",
              "name": "信丰县",
              "areacode": "360700"
            },
            {
              "id": 1283,
              "code": "360723",
              "name": "大余县",
              "areacode": "360700"
            },
            {
              "id": 1284,
              "code": "360724",
              "name": "上犹县",
              "areacode": "360700"
            },
            {
              "id": 1285,
              "code": "360725",
              "name": "崇义县",
              "areacode": "360700"
            },
            {
              "id": 1286,
              "code": "360726",
              "name": "安远县",
              "areacode": "360700"
            },
            {
              "id": 1287,
              "code": "360727",
              "name": "龙南县",
              "areacode": "360700"
            },
            {
              "id": 1288,
              "code": "360728",
              "name": "定南县",
              "areacode": "360700"
            },
            {
              "id": 1289,
              "code": "360729",
              "name": "全南县",
              "areacode": "360700"
            },
            {
              "id": 1290,
              "code": "360730",
              "name": "宁都县",
              "areacode": "360700"
            },
            {
              "id": 1291,
              "code": "360731",
              "name": "于都县",
              "areacode": "360700"
            },
            {
              "id": 1292,
              "code": "360732",
              "name": "兴国县",
              "areacode": "360700"
            },
            {
              "id": 1293,
              "code": "360733",
              "name": "会昌县",
              "areacode": "360700"
            },
            {
              "id": 1294,
              "code": "360734",
              "name": "寻乌县",
              "areacode": "360700"
            },
            {
              "id": 1295,
              "code": "360735",
              "name": "石城县",
              "areacode": "360700"
            },
            {
              "id": 1296,
              "code": "360781",
              "name": "瑞金市",
              "areacode": "360700"
            },
            {
              "id": 1297,
              "code": "360782",
              "name": "南康市",
              "areacode": "360700"
            }
          ]
        },
        {
          "id": 134,
          "code": "360800",
          "name": "吉安市",
          "citycode": "360000",
          "district": [
            {
              "id": 1298,
              "code": "360801",
              "name": "市辖区",
              "areacode": "360800"
            },
            {
              "id": 1299,
              "code": "360802",
              "name": "吉州区",
              "areacode": "360800"
            },
            {
              "id": 1300,
              "code": "360803",
              "name": "青原区",
              "areacode": "360800"
            },
            {
              "id": 1301,
              "code": "360821",
              "name": "吉安县",
              "areacode": "360800"
            },
            {
              "id": 1302,
              "code": "360822",
              "name": "吉水县",
              "areacode": "360800"
            },
            {
              "id": 1303,
              "code": "360823",
              "name": "峡江县",
              "areacode": "360800"
            },
            {
              "id": 1304,
              "code": "360824",
              "name": "新干县",
              "areacode": "360800"
            },
            {
              "id": 1305,
              "code": "360825",
              "name": "永丰县",
              "areacode": "360800"
            },
            {
              "id": 1306,
              "code": "360826",
              "name": "泰和县",
              "areacode": "360800"
            },
            {
              "id": 1307,
              "code": "360827",
              "name": "遂川县",
              "areacode": "360800"
            },
            {
              "id": 1308,
              "code": "360828",
              "name": "万安县",
              "areacode": "360800"
            },
            {
              "id": 1309,
              "code": "360829",
              "name": "安福县",
              "areacode": "360800"
            },
            {
              "id": 1310,
              "code": "360830",
              "name": "永新县",
              "areacode": "360800"
            },
            {
              "id": 1311,
              "code": "360881",
              "name": "井冈山市",
              "areacode": "360800"
            }
          ]
        },
        {
          "id": 135,
          "code": "360900",
          "name": "宜春市",
          "citycode": "360000",
          "district": [
            {
              "id": 1312,
              "code": "360901",
              "name": "市辖区",
              "areacode": "360900"
            },
            {
              "id": 1313,
              "code": "360902",
              "name": "袁州区",
              "areacode": "360900"
            },
            {
              "id": 1314,
              "code": "360921",
              "name": "奉新县",
              "areacode": "360900"
            },
            {
              "id": 1315,
              "code": "360922",
              "name": "万载县",
              "areacode": "360900"
            },
            {
              "id": 1316,
              "code": "360923",
              "name": "上高县",
              "areacode": "360900"
            },
            {
              "id": 1317,
              "code": "360924",
              "name": "宜丰县",
              "areacode": "360900"
            },
            {
              "id": 1318,
              "code": "360925",
              "name": "靖安县",
              "areacode": "360900"
            },
            {
              "id": 1319,
              "code": "360926",
              "name": "铜鼓县",
              "areacode": "360900"
            },
            {
              "id": 1320,
              "code": "360981",
              "name": "丰城市",
              "areacode": "360900"
            },
            {
              "id": 1321,
              "code": "360982",
              "name": "樟树市",
              "areacode": "360900"
            },
            {
              "id": 1322,
              "code": "360983",
              "name": "高安市",
              "areacode": "360900"
            }
          ]
        },
        {
          "id": 136,
          "code": "361000",
          "name": "抚州市",
          "citycode": "360000",
          "district": [
            {
              "id": 1323,
              "code": "361001",
              "name": "市辖区",
              "areacode": "361000"
            },
            {
              "id": 1324,
              "code": "361002",
              "name": "临川区",
              "areacode": "361000"
            },
            {
              "id": 1325,
              "code": "361021",
              "name": "南城县",
              "areacode": "361000"
            },
            {
              "id": 1326,
              "code": "361022",
              "name": "黎川县",
              "areacode": "361000"
            },
            {
              "id": 1327,
              "code": "361023",
              "name": "南丰县",
              "areacode": "361000"
            },
            {
              "id": 1328,
              "code": "361024",
              "name": "崇仁县",
              "areacode": "361000"
            },
            {
              "id": 1329,
              "code": "361025",
              "name": "乐安县",
              "areacode": "361000"
            },
            {
              "id": 1330,
              "code": "361026",
              "name": "宜黄县",
              "areacode": "361000"
            },
            {
              "id": 1331,
              "code": "361027",
              "name": "金溪县",
              "areacode": "361000"
            },
            {
              "id": 1332,
              "code": "361028",
              "name": "资溪县",
              "areacode": "361000"
            },
            {
              "id": 1333,
              "code": "361029",
              "name": "东乡县",
              "areacode": "361000"
            },
            {
              "id": 1334,
              "code": "361030",
              "name": "广昌县",
              "areacode": "361000"
            }
          ]
        },
        {
          "id": 137,
          "code": "361100",
          "name": "上饶市",
          "citycode": "360000",
          "district": [
            {
              "id": 1335,
              "code": "361101",
              "name": "市辖区",
              "areacode": "361100"
            },
            {
              "id": 1336,
              "code": "361102",
              "name": "信州区",
              "areacode": "361100"
            },
            {
              "id": 1337,
              "code": "361121",
              "name": "上饶县",
              "areacode": "361100"
            },
            {
              "id": 1338,
              "code": "361122",
              "name": "广丰县",
              "areacode": "361100"
            },
            {
              "id": 1339,
              "code": "361123",
              "name": "玉山县",
              "areacode": "361100"
            },
            {
              "id": 1340,
              "code": "361124",
              "name": "铅山县",
              "areacode": "361100"
            },
            {
              "id": 1341,
              "code": "361125",
              "name": "横峰县",
              "areacode": "361100"
            },
            {
              "id": 1342,
              "code": "361126",
              "name": "弋阳县",
              "areacode": "361100"
            },
            {
              "id": 1343,
              "code": "361127",
              "name": "余干县",
              "areacode": "361100"
            },
            {
              "id": 1344,
              "code": "361128",
              "name": "鄱阳县",
              "areacode": "361100"
            },
            {
              "id": 1345,
              "code": "361129",
              "name": "万年县",
              "areacode": "361100"
            },
            {
              "id": 1346,
              "code": "361130",
              "name": "婺源县",
              "areacode": "361100"
            },
            {
              "id": 1347,
              "code": "361181",
              "name": "德兴市",
              "areacode": "361100"
            }
          ]
        }
      ]
    },
    {
      "id": 15,
      "code": "370000",
      "name": "山东省",
      "city": [
        {
          "id": 138,
          "code": "370100",
          "name": "济南市",
          "citycode": "370000",
          "district": [
            {
              "id": 1348,
              "code": "370101",
              "name": "市辖区",
              "areacode": "370100"
            },
            {
              "id": 1349,
              "code": "370102",
              "name": "历下区",
              "areacode": "370100"
            },
            {
              "id": 1350,
              "code": "370103",
              "name": "市中区",
              "areacode": "370100"
            },
            {
              "id": 1351,
              "code": "370104",
              "name": "槐荫区",
              "areacode": "370100"
            },
            {
              "id": 1352,
              "code": "370105",
              "name": "天桥区",
              "areacode": "370100"
            },
            {
              "id": 1353,
              "code": "370112",
              "name": "历城区",
              "areacode": "370100"
            },
            {
              "id": 1354,
              "code": "370113",
              "name": "长清区",
              "areacode": "370100"
            },
            {
              "id": 1355,
              "code": "370124",
              "name": "平阴县",
              "areacode": "370100"
            },
            {
              "id": 1356,
              "code": "370125",
              "name": "济阳县",
              "areacode": "370100"
            },
            {
              "id": 1357,
              "code": "370126",
              "name": "商河县",
              "areacode": "370100"
            },
            {
              "id": 1358,
              "code": "370181",
              "name": "章丘市",
              "areacode": "370100"
            }
          ]
        },
        {
          "id": 139,
          "code": "370200",
          "name": "青岛市",
          "citycode": "370000",
          "district": [
            {
              "id": 1359,
              "code": "370201",
              "name": "市辖区",
              "areacode": "370200"
            },
            {
              "id": 1360,
              "code": "370202",
              "name": "市南区",
              "areacode": "370200"
            },
            {
              "id": 1361,
              "code": "370203",
              "name": "市北区",
              "areacode": "370200"
            },
            {
              "id": 1362,
              "code": "370205",
              "name": "四方区",
              "areacode": "370200"
            },
            {
              "id": 1363,
              "code": "370211",
              "name": "黄岛区",
              "areacode": "370200"
            },
            {
              "id": 1364,
              "code": "370212",
              "name": "崂山区",
              "areacode": "370200"
            },
            {
              "id": 1365,
              "code": "370213",
              "name": "李沧区",
              "areacode": "370200"
            },
            {
              "id": 1366,
              "code": "370214",
              "name": "城阳区",
              "areacode": "370200"
            },
            {
              "id": 1367,
              "code": "370281",
              "name": "胶州市",
              "areacode": "370200"
            },
            {
              "id": 1368,
              "code": "370282",
              "name": "即墨市",
              "areacode": "370200"
            },
            {
              "id": 1369,
              "code": "370283",
              "name": "平度市",
              "areacode": "370200"
            },
            {
              "id": 1370,
              "code": "370284",
              "name": "胶南市",
              "areacode": "370200"
            },
            {
              "id": 1371,
              "code": "370285",
              "name": "莱西市",
              "areacode": "370200"
            }
          ]
        },
        {
          "id": 140,
          "code": "370300",
          "name": "淄博市",
          "citycode": "370000",
          "district": [
            {
              "id": 1372,
              "code": "370301",
              "name": "市辖区",
              "areacode": "370300"
            },
            {
              "id": 1373,
              "code": "370302",
              "name": "淄川区",
              "areacode": "370300"
            },
            {
              "id": 1374,
              "code": "370303",
              "name": "张店区",
              "areacode": "370300"
            },
            {
              "id": 1375,
              "code": "370304",
              "name": "博山区",
              "areacode": "370300"
            },
            {
              "id": 1376,
              "code": "370305",
              "name": "临淄区",
              "areacode": "370300"
            },
            {
              "id": 1377,
              "code": "370306",
              "name": "周村区",
              "areacode": "370300"
            },
            {
              "id": 1378,
              "code": "370321",
              "name": "桓台县",
              "areacode": "370300"
            },
            {
              "id": 1379,
              "code": "370322",
              "name": "高青县",
              "areacode": "370300"
            },
            {
              "id": 1380,
              "code": "370323",
              "name": "沂源县",
              "areacode": "370300"
            }
          ]
        },
        {
          "id": 141,
          "code": "370400",
          "name": "枣庄市",
          "citycode": "370000",
          "district": [
            {
              "id": 1381,
              "code": "370401",
              "name": "市辖区",
              "areacode": "370400"
            },
            {
              "id": 1382,
              "code": "370402",
              "name": "市中区",
              "areacode": "370400"
            },
            {
              "id": 1383,
              "code": "370403",
              "name": "薛城区",
              "areacode": "370400"
            },
            {
              "id": 1384,
              "code": "370404",
              "name": "峄城区",
              "areacode": "370400"
            },
            {
              "id": 1385,
              "code": "370405",
              "name": "台儿庄区",
              "areacode": "370400"
            },
            {
              "id": 1386,
              "code": "370406",
              "name": "山亭区",
              "areacode": "370400"
            },
            {
              "id": 1387,
              "code": "370481",
              "name": "滕州市",
              "areacode": "370400"
            }
          ]
        },
        {
          "id": 142,
          "code": "370500",
          "name": "东营市",
          "citycode": "370000",
          "district": [
            {
              "id": 1388,
              "code": "370501",
              "name": "市辖区",
              "areacode": "370500"
            },
            {
              "id": 1389,
              "code": "370502",
              "name": "东营区",
              "areacode": "370500"
            },
            {
              "id": 1390,
              "code": "370503",
              "name": "河口区",
              "areacode": "370500"
            },
            {
              "id": 1391,
              "code": "370521",
              "name": "垦利县",
              "areacode": "370500"
            },
            {
              "id": 1392,
              "code": "370522",
              "name": "利津县",
              "areacode": "370500"
            },
            {
              "id": 1393,
              "code": "370523",
              "name": "广饶县",
              "areacode": "370500"
            }
          ]
        },
        {
          "id": 143,
          "code": "370600",
          "name": "烟台市",
          "citycode": "370000",
          "district": [
            {
              "id": 1394,
              "code": "370601",
              "name": "市辖区",
              "areacode": "370600"
            },
            {
              "id": 1395,
              "code": "370602",
              "name": "芝罘区",
              "areacode": "370600"
            },
            {
              "id": 1396,
              "code": "370611",
              "name": "福山区",
              "areacode": "370600"
            },
            {
              "id": 1397,
              "code": "370612",
              "name": "牟平区",
              "areacode": "370600"
            },
            {
              "id": 1398,
              "code": "370613",
              "name": "莱山区",
              "areacode": "370600"
            },
            {
              "id": 1399,
              "code": "370634",
              "name": "长岛县",
              "areacode": "370600"
            },
            {
              "id": 1400,
              "code": "370681",
              "name": "龙口市",
              "areacode": "370600"
            },
            {
              "id": 1401,
              "code": "370682",
              "name": "莱阳市",
              "areacode": "370600"
            },
            {
              "id": 1402,
              "code": "370683",
              "name": "莱州市",
              "areacode": "370600"
            },
            {
              "id": 1403,
              "code": "370684",
              "name": "蓬莱市",
              "areacode": "370600"
            },
            {
              "id": 1404,
              "code": "370685",
              "name": "招远市",
              "areacode": "370600"
            },
            {
              "id": 1405,
              "code": "370686",
              "name": "栖霞市",
              "areacode": "370600"
            },
            {
              "id": 1406,
              "code": "370687",
              "name": "海阳市",
              "areacode": "370600"
            }
          ]
        },
        {
          "id": 144,
          "code": "370700",
          "name": "潍坊市",
          "citycode": "370000",
          "district": [
            {
              "id": 1407,
              "code": "370701",
              "name": "市辖区",
              "areacode": "370700"
            },
            {
              "id": 1408,
              "code": "370702",
              "name": "潍城区",
              "areacode": "370700"
            },
            {
              "id": 1409,
              "code": "370703",
              "name": "寒亭区",
              "areacode": "370700"
            },
            {
              "id": 1410,
              "code": "370704",
              "name": "坊子区",
              "areacode": "370700"
            },
            {
              "id": 1411,
              "code": "370705",
              "name": "奎文区",
              "areacode": "370700"
            },
            {
              "id": 1412,
              "code": "370724",
              "name": "临朐县",
              "areacode": "370700"
            },
            {
              "id": 1413,
              "code": "370725",
              "name": "昌乐县",
              "areacode": "370700"
            },
            {
              "id": 1414,
              "code": "370781",
              "name": "青州市",
              "areacode": "370700"
            },
            {
              "id": 1415,
              "code": "370782",
              "name": "诸城市",
              "areacode": "370700"
            },
            {
              "id": 1416,
              "code": "370783",
              "name": "寿光市",
              "areacode": "370700"
            },
            {
              "id": 1417,
              "code": "370784",
              "name": "安丘市",
              "areacode": "370700"
            },
            {
              "id": 1418,
              "code": "370785",
              "name": "高密市",
              "areacode": "370700"
            },
            {
              "id": 1419,
              "code": "370786",
              "name": "昌邑市",
              "areacode": "370700"
            }
          ]
        },
        {
          "id": 145,
          "code": "370800",
          "name": "济宁市",
          "citycode": "370000",
          "district": [
            {
              "id": 1420,
              "code": "370801",
              "name": "市辖区",
              "areacode": "370800"
            },
            {
              "id": 1421,
              "code": "370802",
              "name": "市中区",
              "areacode": "370800"
            },
            {
              "id": 1422,
              "code": "370811",
              "name": "任城区",
              "areacode": "370800"
            },
            {
              "id": 1423,
              "code": "370826",
              "name": "微山县",
              "areacode": "370800"
            },
            {
              "id": 1424,
              "code": "370827",
              "name": "鱼台县",
              "areacode": "370800"
            },
            {
              "id": 1425,
              "code": "370828",
              "name": "金乡县",
              "areacode": "370800"
            },
            {
              "id": 1426,
              "code": "370829",
              "name": "嘉祥县",
              "areacode": "370800"
            },
            {
              "id": 1427,
              "code": "370830",
              "name": "汶上县",
              "areacode": "370800"
            },
            {
              "id": 1428,
              "code": "370831",
              "name": "泗水县",
              "areacode": "370800"
            },
            {
              "id": 1429,
              "code": "370832",
              "name": "梁山县",
              "areacode": "370800"
            },
            {
              "id": 1430,
              "code": "370881",
              "name": "曲阜市",
              "areacode": "370800"
            },
            {
              "id": 1431,
              "code": "370882",
              "name": "兖州市",
              "areacode": "370800"
            },
            {
              "id": 1432,
              "code": "370883",
              "name": "邹城市",
              "areacode": "370800"
            }
          ]
        },
        {
          "id": 146,
          "code": "370900",
          "name": "泰安市",
          "citycode": "370000",
          "district": [
            {
              "id": 1433,
              "code": "370901",
              "name": "市辖区",
              "areacode": "370900"
            },
            {
              "id": 1434,
              "code": "370902",
              "name": "泰山区",
              "areacode": "370900"
            },
            {
              "id": 1435,
              "code": "370903",
              "name": "岱岳区",
              "areacode": "370900"
            },
            {
              "id": 1436,
              "code": "370921",
              "name": "宁阳县",
              "areacode": "370900"
            },
            {
              "id": 1437,
              "code": "370923",
              "name": "东平县",
              "areacode": "370900"
            },
            {
              "id": 1438,
              "code": "370982",
              "name": "新泰市",
              "areacode": "370900"
            },
            {
              "id": 1439,
              "code": "370983",
              "name": "肥城市",
              "areacode": "370900"
            }
          ]
        },
        {
          "id": 147,
          "code": "371000",
          "name": "威海市",
          "citycode": "370000",
          "district": [
            {
              "id": 1440,
              "code": "371001",
              "name": "市辖区",
              "areacode": "371000"
            },
            {
              "id": 1441,
              "code": "371002",
              "name": "环翠区",
              "areacode": "371000"
            },
            {
              "id": 1442,
              "code": "371081",
              "name": "文登市",
              "areacode": "371000"
            },
            {
              "id": 1443,
              "code": "371082",
              "name": "荣成市",
              "areacode": "371000"
            },
            {
              "id": 1444,
              "code": "371083",
              "name": "乳山市",
              "areacode": "371000"
            }
          ]
        },
        {
          "id": 148,
          "code": "371100",
          "name": "日照市",
          "citycode": "370000",
          "district": [
            {
              "id": 1445,
              "code": "371101",
              "name": "市辖区",
              "areacode": "371100"
            },
            {
              "id": 1446,
              "code": "371102",
              "name": "东港区",
              "areacode": "371100"
            },
            {
              "id": 1447,
              "code": "371103",
              "name": "岚山区",
              "areacode": "371100"
            },
            {
              "id": 1448,
              "code": "371121",
              "name": "五莲县",
              "areacode": "371100"
            },
            {
              "id": 1449,
              "code": "371122",
              "name": "莒　县",
              "areacode": "371100"
            }
          ]
        },
        {
          "id": 149,
          "code": "371200",
          "name": "莱芜市",
          "citycode": "370000",
          "district": [
            {
              "id": 1450,
              "code": "371201",
              "name": "市辖区",
              "areacode": "371200"
            },
            {
              "id": 1451,
              "code": "371202",
              "name": "莱城区",
              "areacode": "371200"
            },
            {
              "id": 1452,
              "code": "371203",
              "name": "钢城区",
              "areacode": "371200"
            }
          ]
        },
        {
          "id": 150,
          "code": "371300",
          "name": "临沂市",
          "citycode": "370000",
          "district": [
            {
              "id": 1453,
              "code": "371301",
              "name": "市辖区",
              "areacode": "371300"
            },
            {
              "id": 1454,
              "code": "371302",
              "name": "兰山区",
              "areacode": "371300"
            },
            {
              "id": 1455,
              "code": "371311",
              "name": "罗庄区",
              "areacode": "371300"
            },
            {
              "id": 1456,
              "code": "371312",
              "name": "河东区",
              "areacode": "371300"
            },
            {
              "id": 1457,
              "code": "371321",
              "name": "沂南县",
              "areacode": "371300"
            },
            {
              "id": 1458,
              "code": "371322",
              "name": "郯城县",
              "areacode": "371300"
            },
            {
              "id": 1459,
              "code": "371323",
              "name": "沂水县",
              "areacode": "371300"
            },
            {
              "id": 1460,
              "code": "371324",
              "name": "苍山县",
              "areacode": "371300"
            },
            {
              "id": 1461,
              "code": "371325",
              "name": "费　县",
              "areacode": "371300"
            },
            {
              "id": 1462,
              "code": "371326",
              "name": "平邑县",
              "areacode": "371300"
            },
            {
              "id": 1463,
              "code": "371327",
              "name": "莒南县",
              "areacode": "371300"
            },
            {
              "id": 1464,
              "code": "371328",
              "name": "蒙阴县",
              "areacode": "371300"
            },
            {
              "id": 1465,
              "code": "371329",
              "name": "临沭县",
              "areacode": "371300"
            }
          ]
        },
        {
          "id": 151,
          "code": "371400",
          "name": "德州市",
          "citycode": "370000",
          "district": [
            {
              "id": 1466,
              "code": "371401",
              "name": "市辖区",
              "areacode": "371400"
            },
            {
              "id": 1467,
              "code": "371402",
              "name": "德城区",
              "areacode": "371400"
            },
            {
              "id": 1468,
              "code": "371421",
              "name": "陵　县",
              "areacode": "371400"
            },
            {
              "id": 1469,
              "code": "371422",
              "name": "宁津县",
              "areacode": "371400"
            },
            {
              "id": 1470,
              "code": "371423",
              "name": "庆云县",
              "areacode": "371400"
            },
            {
              "id": 1471,
              "code": "371424",
              "name": "临邑县",
              "areacode": "371400"
            },
            {
              "id": 1472,
              "code": "371425",
              "name": "齐河县",
              "areacode": "371400"
            },
            {
              "id": 1473,
              "code": "371426",
              "name": "平原县",
              "areacode": "371400"
            },
            {
              "id": 1474,
              "code": "371427",
              "name": "夏津县",
              "areacode": "371400"
            },
            {
              "id": 1475,
              "code": "371428",
              "name": "武城县",
              "areacode": "371400"
            },
            {
              "id": 1476,
              "code": "371481",
              "name": "乐陵市",
              "areacode": "371400"
            },
            {
              "id": 1477,
              "code": "371482",
              "name": "禹城市",
              "areacode": "371400"
            }
          ]
        },
        {
          "id": 152,
          "code": "371500",
          "name": "聊城市",
          "citycode": "370000",
          "district": [
            {
              "id": 1478,
              "code": "371501",
              "name": "市辖区",
              "areacode": "371500"
            },
            {
              "id": 1479,
              "code": "371502",
              "name": "东昌府区",
              "areacode": "371500"
            },
            {
              "id": 1480,
              "code": "371521",
              "name": "阳谷县",
              "areacode": "371500"
            },
            {
              "id": 1481,
              "code": "371522",
              "name": "莘　县",
              "areacode": "371500"
            },
            {
              "id": 1482,
              "code": "371523",
              "name": "茌平县",
              "areacode": "371500"
            },
            {
              "id": 1483,
              "code": "371524",
              "name": "东阿县",
              "areacode": "371500"
            },
            {
              "id": 1484,
              "code": "371525",
              "name": "冠　县",
              "areacode": "371500"
            },
            {
              "id": 1485,
              "code": "371526",
              "name": "高唐县",
              "areacode": "371500"
            },
            {
              "id": 1486,
              "code": "371581",
              "name": "临清市",
              "areacode": "371500"
            }
          ]
        },
        {
          "id": 153,
          "code": "371600",
          "name": "滨州市",
          "citycode": "370000",
          "district": [
            {
              "id": 1487,
              "code": "371601",
              "name": "市辖区",
              "areacode": "371600"
            },
            {
              "id": 1488,
              "code": "371602",
              "name": "滨城区",
              "areacode": "371600"
            },
            {
              "id": 1489,
              "code": "371621",
              "name": "惠民县",
              "areacode": "371600"
            },
            {
              "id": 1490,
              "code": "371622",
              "name": "阳信县",
              "areacode": "371600"
            },
            {
              "id": 1491,
              "code": "371623",
              "name": "无棣县",
              "areacode": "371600"
            },
            {
              "id": 1492,
              "code": "371624",
              "name": "沾化县",
              "areacode": "371600"
            },
            {
              "id": 1493,
              "code": "371625",
              "name": "博兴县",
              "areacode": "371600"
            },
            {
              "id": 1494,
              "code": "371626",
              "name": "邹平县",
              "areacode": "371600"
            }
          ]
        },
        {
          "id": 154,
          "code": "371700",
          "name": "荷泽市",
          "citycode": "370000",
          "district": [
            {
              "id": 1495,
              "code": "371701",
              "name": "市辖区",
              "areacode": "371700"
            },
            {
              "id": 1496,
              "code": "371702",
              "name": "牡丹区",
              "areacode": "371700"
            },
            {
              "id": 1497,
              "code": "371721",
              "name": "曹　县",
              "areacode": "371700"
            },
            {
              "id": 1498,
              "code": "371722",
              "name": "单　县",
              "areacode": "371700"
            },
            {
              "id": 1499,
              "code": "371723",
              "name": "成武县",
              "areacode": "371700"
            },
            {
              "id": 1500,
              "code": "371724",
              "name": "巨野县",
              "areacode": "371700"
            },
            {
              "id": 1501,
              "code": "371725",
              "name": "郓城县",
              "areacode": "371700"
            },
            {
              "id": 1502,
              "code": "371726",
              "name": "鄄城县",
              "areacode": "371700"
            },
            {
              "id": 1503,
              "code": "371727",
              "name": "定陶县",
              "areacode": "371700"
            },
            {
              "id": 1504,
              "code": "371728",
              "name": "东明县",
              "areacode": "371700"
            }
          ]
        }
      ]
    },
    {
      "id": 16,
      "code": "410000",
      "name": "河南省",
      "city": [
        {
          "id": 155,
          "code": "410100",
          "name": "郑州市",
          "citycode": "410000",
          "district": [
            {
              "id": 1505,
              "code": "410101",
              "name": "市辖区",
              "areacode": "410100"
            },
            {
              "id": 1506,
              "code": "410102",
              "name": "中原区",
              "areacode": "410100"
            },
            {
              "id": 1507,
              "code": "410103",
              "name": "二七区",
              "areacode": "410100"
            },
            {
              "id": 1508,
              "code": "410104",
              "name": "管城回族区",
              "areacode": "410100"
            },
            {
              "id": 1509,
              "code": "410105",
              "name": "金水区",
              "areacode": "410100"
            },
            {
              "id": 1510,
              "code": "410106",
              "name": "上街区",
              "areacode": "410100"
            },
            {
              "id": 1511,
              "code": "410108",
              "name": "邙山区",
              "areacode": "410100"
            },
            {
              "id": 1512,
              "code": "410122",
              "name": "中牟县",
              "areacode": "410100"
            },
            {
              "id": 1513,
              "code": "410181",
              "name": "巩义市",
              "areacode": "410100"
            },
            {
              "id": 1514,
              "code": "410182",
              "name": "荥阳市",
              "areacode": "410100"
            },
            {
              "id": 1515,
              "code": "410183",
              "name": "新密市",
              "areacode": "410100"
            },
            {
              "id": 1516,
              "code": "410184",
              "name": "新郑市",
              "areacode": "410100"
            },
            {
              "id": 1517,
              "code": "410185",
              "name": "登封市",
              "areacode": "410100"
            }
          ]
        },
        {
          "id": 156,
          "code": "410200",
          "name": "开封市",
          "citycode": "410000",
          "district": [
            {
              "id": 1518,
              "code": "410201",
              "name": "市辖区",
              "areacode": "410200"
            },
            {
              "id": 1519,
              "code": "410202",
              "name": "龙亭区",
              "areacode": "410200"
            },
            {
              "id": 1520,
              "code": "410203",
              "name": "顺河回族区",
              "areacode": "410200"
            },
            {
              "id": 1521,
              "code": "410204",
              "name": "鼓楼区",
              "areacode": "410200"
            },
            {
              "id": 1522,
              "code": "410205",
              "name": "南关区",
              "areacode": "410200"
            },
            {
              "id": 1523,
              "code": "410211",
              "name": "郊　区",
              "areacode": "410200"
            },
            {
              "id": 1524,
              "code": "410221",
              "name": "杞　县",
              "areacode": "410200"
            },
            {
              "id": 1525,
              "code": "410222",
              "name": "通许县",
              "areacode": "410200"
            },
            {
              "id": 1526,
              "code": "410223",
              "name": "尉氏县",
              "areacode": "410200"
            },
            {
              "id": 1527,
              "code": "410224",
              "name": "开封县",
              "areacode": "410200"
            },
            {
              "id": 1528,
              "code": "410225",
              "name": "兰考县",
              "areacode": "410200"
            }
          ]
        },
        {
          "id": 157,
          "code": "410300",
          "name": "洛阳市",
          "citycode": "410000",
          "district": [
            {
              "id": 1529,
              "code": "410301",
              "name": "市辖区",
              "areacode": "410300"
            },
            {
              "id": 1530,
              "code": "410302",
              "name": "老城区",
              "areacode": "410300"
            },
            {
              "id": 1531,
              "code": "410303",
              "name": "西工区",
              "areacode": "410300"
            },
            {
              "id": 1532,
              "code": "410304",
              "name": "廛河回族区",
              "areacode": "410300"
            },
            {
              "id": 1533,
              "code": "410305",
              "name": "涧西区",
              "areacode": "410300"
            },
            {
              "id": 1534,
              "code": "410306",
              "name": "吉利区",
              "areacode": "410300"
            },
            {
              "id": 1535,
              "code": "410307",
              "name": "洛龙区",
              "areacode": "410300"
            },
            {
              "id": 1536,
              "code": "410322",
              "name": "孟津县",
              "areacode": "410300"
            },
            {
              "id": 1537,
              "code": "410323",
              "name": "新安县",
              "areacode": "410300"
            },
            {
              "id": 1538,
              "code": "410324",
              "name": "栾川县",
              "areacode": "410300"
            },
            {
              "id": 1539,
              "code": "410325",
              "name": "嵩　县",
              "areacode": "410300"
            },
            {
              "id": 1540,
              "code": "410326",
              "name": "汝阳县",
              "areacode": "410300"
            },
            {
              "id": 1541,
              "code": "410327",
              "name": "宜阳县",
              "areacode": "410300"
            },
            {
              "id": 1542,
              "code": "410328",
              "name": "洛宁县",
              "areacode": "410300"
            },
            {
              "id": 1543,
              "code": "410329",
              "name": "伊川县",
              "areacode": "410300"
            },
            {
              "id": 1544,
              "code": "410381",
              "name": "偃师市",
              "areacode": "410300"
            }
          ]
        },
        {
          "id": 158,
          "code": "410400",
          "name": "平顶山市",
          "citycode": "410000",
          "district": [
            {
              "id": 1545,
              "code": "410401",
              "name": "市辖区",
              "areacode": "410400"
            },
            {
              "id": 1546,
              "code": "410402",
              "name": "新华区",
              "areacode": "410400"
            },
            {
              "id": 1547,
              "code": "410403",
              "name": "卫东区",
              "areacode": "410400"
            },
            {
              "id": 1548,
              "code": "410404",
              "name": "石龙区",
              "areacode": "410400"
            },
            {
              "id": 1549,
              "code": "410411",
              "name": "湛河区",
              "areacode": "410400"
            },
            {
              "id": 1550,
              "code": "410421",
              "name": "宝丰县",
              "areacode": "410400"
            },
            {
              "id": 1551,
              "code": "410422",
              "name": "叶　县",
              "areacode": "410400"
            },
            {
              "id": 1552,
              "code": "410423",
              "name": "鲁山县",
              "areacode": "410400"
            },
            {
              "id": 1553,
              "code": "410425",
              "name": "郏　县",
              "areacode": "410400"
            },
            {
              "id": 1554,
              "code": "410481",
              "name": "舞钢市",
              "areacode": "410400"
            },
            {
              "id": 1555,
              "code": "410482",
              "name": "汝州市",
              "areacode": "410400"
            }
          ]
        },
        {
          "id": 159,
          "code": "410500",
          "name": "安阳市",
          "citycode": "410000",
          "district": [
            {
              "id": 1556,
              "code": "410501",
              "name": "市辖区",
              "areacode": "410500"
            },
            {
              "id": 1557,
              "code": "410502",
              "name": "文峰区",
              "areacode": "410500"
            },
            {
              "id": 1558,
              "code": "410503",
              "name": "北关区",
              "areacode": "410500"
            },
            {
              "id": 1559,
              "code": "410505",
              "name": "殷都区",
              "areacode": "410500"
            },
            {
              "id": 1560,
              "code": "410506",
              "name": "龙安区",
              "areacode": "410500"
            },
            {
              "id": 1561,
              "code": "410522",
              "name": "安阳县",
              "areacode": "410500"
            },
            {
              "id": 1562,
              "code": "410523",
              "name": "汤阴县",
              "areacode": "410500"
            },
            {
              "id": 1563,
              "code": "410526",
              "name": "滑　县",
              "areacode": "410500"
            },
            {
              "id": 1564,
              "code": "410527",
              "name": "内黄县",
              "areacode": "410500"
            },
            {
              "id": 1565,
              "code": "410581",
              "name": "林州市",
              "areacode": "410500"
            }
          ]
        },
        {
          "id": 160,
          "code": "410600",
          "name": "鹤壁市",
          "citycode": "410000",
          "district": [
            {
              "id": 1566,
              "code": "410601",
              "name": "市辖区",
              "areacode": "410600"
            },
            {
              "id": 1567,
              "code": "410602",
              "name": "鹤山区",
              "areacode": "410600"
            },
            {
              "id": 1568,
              "code": "410603",
              "name": "山城区",
              "areacode": "410600"
            },
            {
              "id": 1569,
              "code": "410611",
              "name": "淇滨区",
              "areacode": "410600"
            },
            {
              "id": 1570,
              "code": "410621",
              "name": "浚　县",
              "areacode": "410600"
            },
            {
              "id": 1571,
              "code": "410622",
              "name": "淇　县",
              "areacode": "410600"
            }
          ]
        },
        {
          "id": 161,
          "code": "410700",
          "name": "新乡市",
          "citycode": "410000",
          "district": [
            {
              "id": 1572,
              "code": "410701",
              "name": "市辖区",
              "areacode": "410700"
            },
            {
              "id": 1573,
              "code": "410702",
              "name": "红旗区",
              "areacode": "410700"
            },
            {
              "id": 1574,
              "code": "410703",
              "name": "卫滨区",
              "areacode": "410700"
            },
            {
              "id": 1575,
              "code": "410704",
              "name": "凤泉区",
              "areacode": "410700"
            },
            {
              "id": 1576,
              "code": "410711",
              "name": "牧野区",
              "areacode": "410700"
            },
            {
              "id": 1577,
              "code": "410721",
              "name": "新乡县",
              "areacode": "410700"
            },
            {
              "id": 1578,
              "code": "410724",
              "name": "获嘉县",
              "areacode": "410700"
            },
            {
              "id": 1579,
              "code": "410725",
              "name": "原阳县",
              "areacode": "410700"
            },
            {
              "id": 1580,
              "code": "410726",
              "name": "延津县",
              "areacode": "410700"
            },
            {
              "id": 1581,
              "code": "410727",
              "name": "封丘县",
              "areacode": "410700"
            },
            {
              "id": 1582,
              "code": "410728",
              "name": "长垣县",
              "areacode": "410700"
            },
            {
              "id": 1583,
              "code": "410781",
              "name": "卫辉市",
              "areacode": "410700"
            },
            {
              "id": 1584,
              "code": "410782",
              "name": "辉县市",
              "areacode": "410700"
            }
          ]
        },
        {
          "id": 162,
          "code": "410800",
          "name": "焦作市",
          "citycode": "410000",
          "district": [
            {
              "id": 1585,
              "code": "410801",
              "name": "市辖区",
              "areacode": "410800"
            },
            {
              "id": 1586,
              "code": "410802",
              "name": "解放区",
              "areacode": "410800"
            },
            {
              "id": 1587,
              "code": "410803",
              "name": "中站区",
              "areacode": "410800"
            },
            {
              "id": 1588,
              "code": "410804",
              "name": "马村区",
              "areacode": "410800"
            },
            {
              "id": 1589,
              "code": "410811",
              "name": "山阳区",
              "areacode": "410800"
            },
            {
              "id": 1590,
              "code": "410821",
              "name": "修武县",
              "areacode": "410800"
            },
            {
              "id": 1591,
              "code": "410822",
              "name": "博爱县",
              "areacode": "410800"
            },
            {
              "id": 1592,
              "code": "410823",
              "name": "武陟县",
              "areacode": "410800"
            },
            {
              "id": 1593,
              "code": "410825",
              "name": "温　县",
              "areacode": "410800"
            },
            {
              "id": 1594,
              "code": "410881",
              "name": "济源市",
              "areacode": "410800"
            },
            {
              "id": 1595,
              "code": "410882",
              "name": "沁阳市",
              "areacode": "410800"
            },
            {
              "id": 1596,
              "code": "410883",
              "name": "孟州市",
              "areacode": "410800"
            }
          ]
        },
        {
          "id": 163,
          "code": "410900",
          "name": "濮阳市",
          "citycode": "410000",
          "district": [
            {
              "id": 1597,
              "code": "410901",
              "name": "市辖区",
              "areacode": "410900"
            },
            {
              "id": 1598,
              "code": "410902",
              "name": "华龙区",
              "areacode": "410900"
            },
            {
              "id": 1599,
              "code": "410922",
              "name": "清丰县",
              "areacode": "410900"
            },
            {
              "id": 1600,
              "code": "410923",
              "name": "南乐县",
              "areacode": "410900"
            },
            {
              "id": 1601,
              "code": "410926",
              "name": "范　县",
              "areacode": "410900"
            },
            {
              "id": 1602,
              "code": "410927",
              "name": "台前县",
              "areacode": "410900"
            },
            {
              "id": 1603,
              "code": "410928",
              "name": "濮阳县",
              "areacode": "410900"
            }
          ]
        },
        {
          "id": 164,
          "code": "411000",
          "name": "许昌市",
          "citycode": "410000",
          "district": [
            {
              "id": 1604,
              "code": "411001",
              "name": "市辖区",
              "areacode": "411000"
            },
            {
              "id": 1605,
              "code": "411002",
              "name": "魏都区",
              "areacode": "411000"
            },
            {
              "id": 1606,
              "code": "411023",
              "name": "许昌县",
              "areacode": "411000"
            },
            {
              "id": 1607,
              "code": "411024",
              "name": "鄢陵县",
              "areacode": "411000"
            },
            {
              "id": 1608,
              "code": "411025",
              "name": "襄城县",
              "areacode": "411000"
            },
            {
              "id": 1609,
              "code": "411081",
              "name": "禹州市",
              "areacode": "411000"
            },
            {
              "id": 1610,
              "code": "411082",
              "name": "长葛市",
              "areacode": "411000"
            }
          ]
        },
        {
          "id": 165,
          "code": "411100",
          "name": "漯河市",
          "citycode": "410000",
          "district": [
            {
              "id": 1611,
              "code": "411101",
              "name": "市辖区",
              "areacode": "411100"
            },
            {
              "id": 1612,
              "code": "411102",
              "name": "源汇区",
              "areacode": "411100"
            },
            {
              "id": 1613,
              "code": "411103",
              "name": "郾城区",
              "areacode": "411100"
            },
            {
              "id": 1614,
              "code": "411104",
              "name": "召陵区",
              "areacode": "411100"
            },
            {
              "id": 1615,
              "code": "411121",
              "name": "舞阳县",
              "areacode": "411100"
            },
            {
              "id": 1616,
              "code": "411122",
              "name": "临颍县",
              "areacode": "411100"
            }
          ]
        },
        {
          "id": 166,
          "code": "411200",
          "name": "三门峡市",
          "citycode": "410000",
          "district": [
            {
              "id": 1617,
              "code": "411201",
              "name": "市辖区",
              "areacode": "411200"
            },
            {
              "id": 1618,
              "code": "411202",
              "name": "湖滨区",
              "areacode": "411200"
            },
            {
              "id": 1619,
              "code": "411221",
              "name": "渑池县",
              "areacode": "411200"
            },
            {
              "id": 1620,
              "code": "411222",
              "name": "陕　县",
              "areacode": "411200"
            },
            {
              "id": 1621,
              "code": "411224",
              "name": "卢氏县",
              "areacode": "411200"
            },
            {
              "id": 1622,
              "code": "411281",
              "name": "义马市",
              "areacode": "411200"
            },
            {
              "id": 1623,
              "code": "411282",
              "name": "灵宝市",
              "areacode": "411200"
            }
          ]
        },
        {
          "id": 167,
          "code": "411300",
          "name": "南阳市",
          "citycode": "410000",
          "district": [
            {
              "id": 1624,
              "code": "411301",
              "name": "市辖区",
              "areacode": "411300"
            },
            {
              "id": 1625,
              "code": "411302",
              "name": "宛城区",
              "areacode": "411300"
            },
            {
              "id": 1626,
              "code": "411303",
              "name": "卧龙区",
              "areacode": "411300"
            },
            {
              "id": 1627,
              "code": "411321",
              "name": "南召县",
              "areacode": "411300"
            },
            {
              "id": 1628,
              "code": "411322",
              "name": "方城县",
              "areacode": "411300"
            },
            {
              "id": 1629,
              "code": "411323",
              "name": "西峡县",
              "areacode": "411300"
            },
            {
              "id": 1630,
              "code": "411324",
              "name": "镇平县",
              "areacode": "411300"
            },
            {
              "id": 1631,
              "code": "411325",
              "name": "内乡县",
              "areacode": "411300"
            },
            {
              "id": 1632,
              "code": "411326",
              "name": "淅川县",
              "areacode": "411300"
            },
            {
              "id": 1633,
              "code": "411327",
              "name": "社旗县",
              "areacode": "411300"
            },
            {
              "id": 1634,
              "code": "411328",
              "name": "唐河县",
              "areacode": "411300"
            },
            {
              "id": 1635,
              "code": "411329",
              "name": "新野县",
              "areacode": "411300"
            },
            {
              "id": 1636,
              "code": "411330",
              "name": "桐柏县",
              "areacode": "411300"
            },
            {
              "id": 1637,
              "code": "411381",
              "name": "邓州市",
              "areacode": "411300"
            }
          ]
        },
        {
          "id": 168,
          "code": "411400",
          "name": "商丘市",
          "citycode": "410000",
          "district": [
            {
              "id": 1638,
              "code": "411401",
              "name": "市辖区",
              "areacode": "411400"
            },
            {
              "id": 1639,
              "code": "411402",
              "name": "梁园区",
              "areacode": "411400"
            },
            {
              "id": 1640,
              "code": "411403",
              "name": "睢阳区",
              "areacode": "411400"
            },
            {
              "id": 1641,
              "code": "411421",
              "name": "民权县",
              "areacode": "411400"
            },
            {
              "id": 1642,
              "code": "411422",
              "name": "睢　县",
              "areacode": "411400"
            },
            {
              "id": 1643,
              "code": "411423",
              "name": "宁陵县",
              "areacode": "411400"
            },
            {
              "id": 1644,
              "code": "411424",
              "name": "柘城县",
              "areacode": "411400"
            },
            {
              "id": 1645,
              "code": "411425",
              "name": "虞城县",
              "areacode": "411400"
            },
            {
              "id": 1646,
              "code": "411426",
              "name": "夏邑县",
              "areacode": "411400"
            },
            {
              "id": 1647,
              "code": "411481",
              "name": "永城市",
              "areacode": "411400"
            }
          ]
        },
        {
          "id": 169,
          "code": "411500",
          "name": "信阳市",
          "citycode": "410000",
          "district": [
            {
              "id": 1648,
              "code": "411501",
              "name": "市辖区",
              "areacode": "411500"
            },
            {
              "id": 1649,
              "code": "411502",
              "name": "师河区",
              "areacode": "411500"
            },
            {
              "id": 1650,
              "code": "411503",
              "name": "平桥区",
              "areacode": "411500"
            },
            {
              "id": 1651,
              "code": "411521",
              "name": "罗山县",
              "areacode": "411500"
            },
            {
              "id": 1652,
              "code": "411522",
              "name": "光山县",
              "areacode": "411500"
            },
            {
              "id": 1653,
              "code": "411523",
              "name": "新　县",
              "areacode": "411500"
            },
            {
              "id": 1654,
              "code": "411524",
              "name": "商城县",
              "areacode": "411500"
            },
            {
              "id": 1655,
              "code": "411525",
              "name": "固始县",
              "areacode": "411500"
            },
            {
              "id": 1656,
              "code": "411526",
              "name": "潢川县",
              "areacode": "411500"
            },
            {
              "id": 1657,
              "code": "411527",
              "name": "淮滨县",
              "areacode": "411500"
            },
            {
              "id": 1658,
              "code": "411528",
              "name": "息　县",
              "areacode": "411500"
            }
          ]
        },
        {
          "id": 170,
          "code": "411600",
          "name": "周口市",
          "citycode": "410000",
          "district": [
            {
              "id": 1659,
              "code": "411601",
              "name": "市辖区",
              "areacode": "411600"
            },
            {
              "id": 1660,
              "code": "411602",
              "name": "川汇区",
              "areacode": "411600"
            },
            {
              "id": 1661,
              "code": "411621",
              "name": "扶沟县",
              "areacode": "411600"
            },
            {
              "id": 1662,
              "code": "411622",
              "name": "西华县",
              "areacode": "411600"
            },
            {
              "id": 1663,
              "code": "411623",
              "name": "商水县",
              "areacode": "411600"
            },
            {
              "id": 1664,
              "code": "411624",
              "name": "沈丘县",
              "areacode": "411600"
            },
            {
              "id": 1665,
              "code": "411625",
              "name": "郸城县",
              "areacode": "411600"
            },
            {
              "id": 1666,
              "code": "411626",
              "name": "淮阳县",
              "areacode": "411600"
            },
            {
              "id": 1667,
              "code": "411627",
              "name": "太康县",
              "areacode": "411600"
            },
            {
              "id": 1668,
              "code": "411628",
              "name": "鹿邑县",
              "areacode": "411600"
            },
            {
              "id": 1669,
              "code": "411681",
              "name": "项城市",
              "areacode": "411600"
            }
          ]
        },
        {
          "id": 171,
          "code": "411700",
          "name": "驻马店市",
          "citycode": "410000",
          "district": [
            {
              "id": 1670,
              "code": "411701",
              "name": "市辖区",
              "areacode": "411700"
            },
            {
              "id": 1671,
              "code": "411702",
              "name": "驿城区",
              "areacode": "411700"
            },
            {
              "id": 1672,
              "code": "411721",
              "name": "西平县",
              "areacode": "411700"
            },
            {
              "id": 1673,
              "code": "411722",
              "name": "上蔡县",
              "areacode": "411700"
            },
            {
              "id": 1674,
              "code": "411723",
              "name": "平舆县",
              "areacode": "411700"
            },
            {
              "id": 1675,
              "code": "411724",
              "name": "正阳县",
              "areacode": "411700"
            },
            {
              "id": 1676,
              "code": "411725",
              "name": "确山县",
              "areacode": "411700"
            },
            {
              "id": 1677,
              "code": "411726",
              "name": "泌阳县",
              "areacode": "411700"
            },
            {
              "id": 1678,
              "code": "411727",
              "name": "汝南县",
              "areacode": "411700"
            },
            {
              "id": 1679,
              "code": "411728",
              "name": "遂平县",
              "areacode": "411700"
            },
            {
              "id": 1680,
              "code": "411729",
              "name": "新蔡县",
              "areacode": "411700"
            }
          ]
        }
      ]
    },
    {
      "id": 17,
      "code": "420000",
      "name": "湖北省",
      "city": [
        {
          "id": 172,
          "code": "420100",
          "name": "武汉市",
          "citycode": "420000",
          "district": [
            {
              "id": 1681,
              "code": "420101",
              "name": "市辖区",
              "areacode": "420100"
            },
            {
              "id": 1682,
              "code": "420102",
              "name": "江岸区",
              "areacode": "420100"
            },
            {
              "id": 1683,
              "code": "420103",
              "name": "江汉区",
              "areacode": "420100"
            },
            {
              "id": 1684,
              "code": "420104",
              "name": "乔口区",
              "areacode": "420100"
            },
            {
              "id": 1685,
              "code": "420105",
              "name": "汉阳区",
              "areacode": "420100"
            },
            {
              "id": 1686,
              "code": "420106",
              "name": "武昌区",
              "areacode": "420100"
            },
            {
              "id": 1687,
              "code": "420107",
              "name": "青山区",
              "areacode": "420100"
            },
            {
              "id": 1688,
              "code": "420111",
              "name": "洪山区",
              "areacode": "420100"
            },
            {
              "id": 1689,
              "code": "420112",
              "name": "东西湖区",
              "areacode": "420100"
            },
            {
              "id": 1690,
              "code": "420113",
              "name": "汉南区",
              "areacode": "420100"
            },
            {
              "id": 1691,
              "code": "420114",
              "name": "蔡甸区",
              "areacode": "420100"
            },
            {
              "id": 1692,
              "code": "420115",
              "name": "江夏区",
              "areacode": "420100"
            },
            {
              "id": 1693,
              "code": "420116",
              "name": "黄陂区",
              "areacode": "420100"
            },
            {
              "id": 1694,
              "code": "420117",
              "name": "新洲区",
              "areacode": "420100"
            }
          ]
        },
        {
          "id": 173,
          "code": "420200",
          "name": "黄石市",
          "citycode": "420000",
          "district": [
            {
              "id": 1695,
              "code": "420201",
              "name": "市辖区",
              "areacode": "420200"
            },
            {
              "id": 1696,
              "code": "420202",
              "name": "黄石港区",
              "areacode": "420200"
            },
            {
              "id": 1697,
              "code": "420203",
              "name": "西塞山区",
              "areacode": "420200"
            },
            {
              "id": 1698,
              "code": "420204",
              "name": "下陆区",
              "areacode": "420200"
            },
            {
              "id": 1699,
              "code": "420205",
              "name": "铁山区",
              "areacode": "420200"
            },
            {
              "id": 1700,
              "code": "420222",
              "name": "阳新县",
              "areacode": "420200"
            },
            {
              "id": 1701,
              "code": "420281",
              "name": "大冶市",
              "areacode": "420200"
            }
          ]
        },
        {
          "id": 174,
          "code": "420300",
          "name": "十堰市",
          "citycode": "420000",
          "district": [
            {
              "id": 1702,
              "code": "420301",
              "name": "市辖区",
              "areacode": "420300"
            },
            {
              "id": 1703,
              "code": "420302",
              "name": "茅箭区",
              "areacode": "420300"
            },
            {
              "id": 1704,
              "code": "420303",
              "name": "张湾区",
              "areacode": "420300"
            },
            {
              "id": 1705,
              "code": "420321",
              "name": "郧　县",
              "areacode": "420300"
            },
            {
              "id": 1706,
              "code": "420322",
              "name": "郧西县",
              "areacode": "420300"
            },
            {
              "id": 1707,
              "code": "420323",
              "name": "竹山县",
              "areacode": "420300"
            },
            {
              "id": 1708,
              "code": "420324",
              "name": "竹溪县",
              "areacode": "420300"
            },
            {
              "id": 1709,
              "code": "420325",
              "name": "房　县",
              "areacode": "420300"
            },
            {
              "id": 1710,
              "code": "420381",
              "name": "丹江口市",
              "areacode": "420300"
            }
          ]
        },
        {
          "id": 175,
          "code": "420500",
          "name": "宜昌市",
          "citycode": "420000",
          "district": [
            {
              "id": 1711,
              "code": "420501",
              "name": "市辖区",
              "areacode": "420500"
            },
            {
              "id": 1712,
              "code": "420502",
              "name": "西陵区",
              "areacode": "420500"
            },
            {
              "id": 1713,
              "code": "420503",
              "name": "伍家岗区",
              "areacode": "420500"
            },
            {
              "id": 1714,
              "code": "420504",
              "name": "点军区",
              "areacode": "420500"
            },
            {
              "id": 1715,
              "code": "420505",
              "name": "猇亭区",
              "areacode": "420500"
            },
            {
              "id": 1716,
              "code": "420506",
              "name": "夷陵区",
              "areacode": "420500"
            },
            {
              "id": 1717,
              "code": "420525",
              "name": "远安县",
              "areacode": "420500"
            },
            {
              "id": 1718,
              "code": "420526",
              "name": "兴山县",
              "areacode": "420500"
            },
            {
              "id": 1719,
              "code": "420527",
              "name": "秭归县",
              "areacode": "420500"
            },
            {
              "id": 1720,
              "code": "420528",
              "name": "长阳土家族自治县",
              "areacode": "420500"
            },
            {
              "id": 1721,
              "code": "420529",
              "name": "五峰土家族自治县",
              "areacode": "420500"
            },
            {
              "id": 1722,
              "code": "420581",
              "name": "宜都市",
              "areacode": "420500"
            },
            {
              "id": 1723,
              "code": "420582",
              "name": "当阳市",
              "areacode": "420500"
            },
            {
              "id": 1724,
              "code": "420583",
              "name": "枝江市",
              "areacode": "420500"
            }
          ]
        },
        {
          "id": 176,
          "code": "420600",
          "name": "襄樊市",
          "citycode": "420000",
          "district": [
            {
              "id": 1725,
              "code": "420601",
              "name": "市辖区",
              "areacode": "420600"
            },
            {
              "id": 1726,
              "code": "420602",
              "name": "襄城区",
              "areacode": "420600"
            },
            {
              "id": 1727,
              "code": "420606",
              "name": "樊城区",
              "areacode": "420600"
            },
            {
              "id": 1728,
              "code": "420607",
              "name": "襄阳区",
              "areacode": "420600"
            },
            {
              "id": 1729,
              "code": "420624",
              "name": "南漳县",
              "areacode": "420600"
            },
            {
              "id": 1730,
              "code": "420625",
              "name": "谷城县",
              "areacode": "420600"
            },
            {
              "id": 1731,
              "code": "420626",
              "name": "保康县",
              "areacode": "420600"
            },
            {
              "id": 1732,
              "code": "420682",
              "name": "老河口市",
              "areacode": "420600"
            },
            {
              "id": 1733,
              "code": "420683",
              "name": "枣阳市",
              "areacode": "420600"
            },
            {
              "id": 1734,
              "code": "420684",
              "name": "宜城市",
              "areacode": "420600"
            }
          ]
        },
        {
          "id": 177,
          "code": "420700",
          "name": "鄂州市",
          "citycode": "420000",
          "district": [
            {
              "id": 1735,
              "code": "420701",
              "name": "市辖区",
              "areacode": "420700"
            },
            {
              "id": 1736,
              "code": "420702",
              "name": "梁子湖区",
              "areacode": "420700"
            },
            {
              "id": 1737,
              "code": "420703",
              "name": "华容区",
              "areacode": "420700"
            },
            {
              "id": 1738,
              "code": "420704",
              "name": "鄂城区",
              "areacode": "420700"
            }
          ]
        },
        {
          "id": 178,
          "code": "420800",
          "name": "荆门市",
          "citycode": "420000",
          "district": [
            {
              "id": 1739,
              "code": "420801",
              "name": "市辖区",
              "areacode": "420800"
            },
            {
              "id": 1740,
              "code": "420802",
              "name": "东宝区",
              "areacode": "420800"
            },
            {
              "id": 1741,
              "code": "420804",
              "name": "掇刀区",
              "areacode": "420800"
            },
            {
              "id": 1742,
              "code": "420821",
              "name": "京山县",
              "areacode": "420800"
            },
            {
              "id": 1743,
              "code": "420822",
              "name": "沙洋县",
              "areacode": "420800"
            },
            {
              "id": 1744,
              "code": "420881",
              "name": "钟祥市",
              "areacode": "420800"
            }
          ]
        },
        {
          "id": 179,
          "code": "420900",
          "name": "孝感市",
          "citycode": "420000",
          "district": [
            {
              "id": 1745,
              "code": "420901",
              "name": "市辖区",
              "areacode": "420900"
            },
            {
              "id": 1746,
              "code": "420902",
              "name": "孝南区",
              "areacode": "420900"
            },
            {
              "id": 1747,
              "code": "420921",
              "name": "孝昌县",
              "areacode": "420900"
            },
            {
              "id": 1748,
              "code": "420922",
              "name": "大悟县",
              "areacode": "420900"
            },
            {
              "id": 1749,
              "code": "420923",
              "name": "云梦县",
              "areacode": "420900"
            },
            {
              "id": 1750,
              "code": "420981",
              "name": "应城市",
              "areacode": "420900"
            },
            {
              "id": 1751,
              "code": "420982",
              "name": "安陆市",
              "areacode": "420900"
            },
            {
              "id": 1752,
              "code": "420984",
              "name": "汉川市",
              "areacode": "420900"
            }
          ]
        },
        {
          "id": 180,
          "code": "421000",
          "name": "荆州市",
          "citycode": "420000",
          "district": [
            {
              "id": 1753,
              "code": "421001",
              "name": "市辖区",
              "areacode": "421000"
            },
            {
              "id": 1754,
              "code": "421002",
              "name": "沙市区",
              "areacode": "421000"
            },
            {
              "id": 1755,
              "code": "421003",
              "name": "荆州区",
              "areacode": "421000"
            },
            {
              "id": 1756,
              "code": "421022",
              "name": "公安县",
              "areacode": "421000"
            },
            {
              "id": 1757,
              "code": "421023",
              "name": "监利县",
              "areacode": "421000"
            },
            {
              "id": 1758,
              "code": "421024",
              "name": "江陵县",
              "areacode": "421000"
            },
            {
              "id": 1759,
              "code": "421081",
              "name": "石首市",
              "areacode": "421000"
            },
            {
              "id": 1760,
              "code": "421083",
              "name": "洪湖市",
              "areacode": "421000"
            },
            {
              "id": 1761,
              "code": "421087",
              "name": "松滋市",
              "areacode": "421000"
            }
          ]
        },
        {
          "id": 181,
          "code": "421100",
          "name": "黄冈市",
          "citycode": "420000",
          "district": [
            {
              "id": 1762,
              "code": "421101",
              "name": "市辖区",
              "areacode": "421100"
            },
            {
              "id": 1763,
              "code": "421102",
              "name": "黄州区",
              "areacode": "421100"
            },
            {
              "id": 1764,
              "code": "421121",
              "name": "团风县",
              "areacode": "421100"
            },
            {
              "id": 1765,
              "code": "421122",
              "name": "红安县",
              "areacode": "421100"
            },
            {
              "id": 1766,
              "code": "421123",
              "name": "罗田县",
              "areacode": "421100"
            },
            {
              "id": 1767,
              "code": "421124",
              "name": "英山县",
              "areacode": "421100"
            },
            {
              "id": 1768,
              "code": "421125",
              "name": "浠水县",
              "areacode": "421100"
            },
            {
              "id": 1769,
              "code": "421126",
              "name": "蕲春县",
              "areacode": "421100"
            },
            {
              "id": 1770,
              "code": "421127",
              "name": "黄梅县",
              "areacode": "421100"
            },
            {
              "id": 1771,
              "code": "421181",
              "name": "麻城市",
              "areacode": "421100"
            },
            {
              "id": 1772,
              "code": "421182",
              "name": "武穴市",
              "areacode": "421100"
            }
          ]
        },
        {
          "id": 182,
          "code": "421200",
          "name": "咸宁市",
          "citycode": "420000",
          "district": [
            {
              "id": 1773,
              "code": "421201",
              "name": "市辖区",
              "areacode": "421200"
            },
            {
              "id": 1774,
              "code": "421202",
              "name": "咸安区",
              "areacode": "421200"
            },
            {
              "id": 1775,
              "code": "421221",
              "name": "嘉鱼县",
              "areacode": "421200"
            },
            {
              "id": 1776,
              "code": "421222",
              "name": "通城县",
              "areacode": "421200"
            },
            {
              "id": 1777,
              "code": "421223",
              "name": "崇阳县",
              "areacode": "421200"
            },
            {
              "id": 1778,
              "code": "421224",
              "name": "通山县",
              "areacode": "421200"
            },
            {
              "id": 1779,
              "code": "421281",
              "name": "赤壁市",
              "areacode": "421200"
            }
          ]
        },
        {
          "id": 183,
          "code": "421300",
          "name": "随州市",
          "citycode": "420000",
          "district": [
            {
              "id": 1780,
              "code": "421301",
              "name": "市辖区",
              "areacode": "421300"
            },
            {
              "id": 1781,
              "code": "421302",
              "name": "曾都区",
              "areacode": "421300"
            },
            {
              "id": 1782,
              "code": "421381",
              "name": "广水市",
              "areacode": "421300"
            }
          ]
        },
        {
          "id": 184,
          "code": "422800",
          "name": "恩施土家族苗族自治州",
          "citycode": "420000",
          "district": [
            {
              "id": 1783,
              "code": "422801",
              "name": "恩施市",
              "areacode": "422800"
            },
            {
              "id": 1784,
              "code": "422802",
              "name": "利川市",
              "areacode": "422800"
            },
            {
              "id": 1785,
              "code": "422822",
              "name": "建始县",
              "areacode": "422800"
            },
            {
              "id": 1786,
              "code": "422823",
              "name": "巴东县",
              "areacode": "422800"
            },
            {
              "id": 1787,
              "code": "422825",
              "name": "宣恩县",
              "areacode": "422800"
            },
            {
              "id": 1788,
              "code": "422826",
              "name": "咸丰县",
              "areacode": "422800"
            },
            {
              "id": 1789,
              "code": "422827",
              "name": "来凤县",
              "areacode": "422800"
            },
            {
              "id": 1790,
              "code": "422828",
              "name": "鹤峰县",
              "areacode": "422800"
            }
          ]
        },
        {
          "id": 185,
          "code": "429000",
          "name": "省直辖行政单位",
          "citycode": "420000",
          "district": [
            {
              "id": 1791,
              "code": "429004",
              "name": "仙桃市",
              "areacode": "429000"
            },
            {
              "id": 1792,
              "code": "429005",
              "name": "潜江市",
              "areacode": "429000"
            },
            {
              "id": 1793,
              "code": "429006",
              "name": "天门市",
              "areacode": "429000"
            },
            {
              "id": 1794,
              "code": "429021",
              "name": "神农架林区",
              "areacode": "429000"
            }
          ]
        }
      ]
    },
    {
      "id": 18,
      "code": "430000",
      "name": "湖南省",
      "city": [
        {
          "id": 186,
          "code": "430100",
          "name": "长沙市",
          "citycode": "430000",
          "district": [
            {
              "id": 1795,
              "code": "430101",
              "name": "市辖区",
              "areacode": "430100"
            },
            {
              "id": 1796,
              "code": "430102",
              "name": "芙蓉区",
              "areacode": "430100"
            },
            {
              "id": 1797,
              "code": "430103",
              "name": "天心区",
              "areacode": "430100"
            },
            {
              "id": 1798,
              "code": "430104",
              "name": "岳麓区",
              "areacode": "430100"
            },
            {
              "id": 1799,
              "code": "430105",
              "name": "开福区",
              "areacode": "430100"
            },
            {
              "id": 1800,
              "code": "430111",
              "name": "雨花区",
              "areacode": "430100"
            },
            {
              "id": 1801,
              "code": "430121",
              "name": "长沙县",
              "areacode": "430100"
            },
            {
              "id": 1802,
              "code": "430122",
              "name": "望城县",
              "areacode": "430100"
            },
            {
              "id": 1803,
              "code": "430124",
              "name": "宁乡县",
              "areacode": "430100"
            },
            {
              "id": 1804,
              "code": "430181",
              "name": "浏阳市",
              "areacode": "430100"
            }
          ]
        },
        {
          "id": 187,
          "code": "430200",
          "name": "株洲市",
          "citycode": "430000",
          "district": [
            {
              "id": 1805,
              "code": "430201",
              "name": "市辖区",
              "areacode": "430200"
            },
            {
              "id": 1806,
              "code": "430202",
              "name": "荷塘区",
              "areacode": "430200"
            },
            {
              "id": 1807,
              "code": "430203",
              "name": "芦淞区",
              "areacode": "430200"
            },
            {
              "id": 1808,
              "code": "430204",
              "name": "石峰区",
              "areacode": "430200"
            },
            {
              "id": 1809,
              "code": "430211",
              "name": "天元区",
              "areacode": "430200"
            },
            {
              "id": 1810,
              "code": "430221",
              "name": "株洲县",
              "areacode": "430200"
            },
            {
              "id": 1811,
              "code": "430223",
              "name": "攸　县",
              "areacode": "430200"
            },
            {
              "id": 1812,
              "code": "430224",
              "name": "茶陵县",
              "areacode": "430200"
            },
            {
              "id": 1813,
              "code": "430225",
              "name": "炎陵县",
              "areacode": "430200"
            },
            {
              "id": 1814,
              "code": "430281",
              "name": "醴陵市",
              "areacode": "430200"
            }
          ]
        },
        {
          "id": 188,
          "code": "430300",
          "name": "湘潭市",
          "citycode": "430000",
          "district": [
            {
              "id": 1815,
              "code": "430301",
              "name": "市辖区",
              "areacode": "430300"
            },
            {
              "id": 1816,
              "code": "430302",
              "name": "雨湖区",
              "areacode": "430300"
            },
            {
              "id": 1817,
              "code": "430304",
              "name": "岳塘区",
              "areacode": "430300"
            },
            {
              "id": 1818,
              "code": "430321",
              "name": "湘潭县",
              "areacode": "430300"
            },
            {
              "id": 1819,
              "code": "430381",
              "name": "湘乡市",
              "areacode": "430300"
            },
            {
              "id": 1820,
              "code": "430382",
              "name": "韶山市",
              "areacode": "430300"
            }
          ]
        },
        {
          "id": 189,
          "code": "430400",
          "name": "衡阳市",
          "citycode": "430000",
          "district": [
            {
              "id": 1821,
              "code": "430401",
              "name": "市辖区",
              "areacode": "430400"
            },
            {
              "id": 1822,
              "code": "430405",
              "name": "珠晖区",
              "areacode": "430400"
            },
            {
              "id": 1823,
              "code": "430406",
              "name": "雁峰区",
              "areacode": "430400"
            },
            {
              "id": 1824,
              "code": "430407",
              "name": "石鼓区",
              "areacode": "430400"
            },
            {
              "id": 1825,
              "code": "430408",
              "name": "蒸湘区",
              "areacode": "430400"
            },
            {
              "id": 1826,
              "code": "430412",
              "name": "南岳区",
              "areacode": "430400"
            },
            {
              "id": 1827,
              "code": "430421",
              "name": "衡阳县",
              "areacode": "430400"
            },
            {
              "id": 1828,
              "code": "430422",
              "name": "衡南县",
              "areacode": "430400"
            },
            {
              "id": 1829,
              "code": "430423",
              "name": "衡山县",
              "areacode": "430400"
            },
            {
              "id": 1830,
              "code": "430424",
              "name": "衡东县",
              "areacode": "430400"
            },
            {
              "id": 1831,
              "code": "430426",
              "name": "祁东县",
              "areacode": "430400"
            },
            {
              "id": 1832,
              "code": "430481",
              "name": "耒阳市",
              "areacode": "430400"
            },
            {
              "id": 1833,
              "code": "430482",
              "name": "常宁市",
              "areacode": "430400"
            }
          ]
        },
        {
          "id": 190,
          "code": "430500",
          "name": "邵阳市",
          "citycode": "430000",
          "district": [
            {
              "id": 1834,
              "code": "430501",
              "name": "市辖区",
              "areacode": "430500"
            },
            {
              "id": 1835,
              "code": "430502",
              "name": "双清区",
              "areacode": "430500"
            },
            {
              "id": 1836,
              "code": "430503",
              "name": "大祥区",
              "areacode": "430500"
            },
            {
              "id": 1837,
              "code": "430511",
              "name": "北塔区",
              "areacode": "430500"
            },
            {
              "id": 1838,
              "code": "430521",
              "name": "邵东县",
              "areacode": "430500"
            },
            {
              "id": 1839,
              "code": "430522",
              "name": "新邵县",
              "areacode": "430500"
            },
            {
              "id": 1840,
              "code": "430523",
              "name": "邵阳县",
              "areacode": "430500"
            },
            {
              "id": 1841,
              "code": "430524",
              "name": "隆回县",
              "areacode": "430500"
            },
            {
              "id": 1842,
              "code": "430525",
              "name": "洞口县",
              "areacode": "430500"
            },
            {
              "id": 1843,
              "code": "430527",
              "name": "绥宁县",
              "areacode": "430500"
            },
            {
              "id": 1844,
              "code": "430528",
              "name": "新宁县",
              "areacode": "430500"
            },
            {
              "id": 1845,
              "code": "430529",
              "name": "城步苗族自治县",
              "areacode": "430500"
            },
            {
              "id": 1846,
              "code": "430581",
              "name": "武冈市",
              "areacode": "430500"
            }
          ]
        },
        {
          "id": 191,
          "code": "430600",
          "name": "岳阳市",
          "citycode": "430000",
          "district": [
            {
              "id": 1847,
              "code": "430601",
              "name": "市辖区",
              "areacode": "430600"
            },
            {
              "id": 1848,
              "code": "430602",
              "name": "岳阳楼区",
              "areacode": "430600"
            },
            {
              "id": 1849,
              "code": "430603",
              "name": "云溪区",
              "areacode": "430600"
            },
            {
              "id": 1850,
              "code": "430611",
              "name": "君山区",
              "areacode": "430600"
            },
            {
              "id": 1851,
              "code": "430621",
              "name": "岳阳县",
              "areacode": "430600"
            },
            {
              "id": 1852,
              "code": "430623",
              "name": "华容县",
              "areacode": "430600"
            },
            {
              "id": 1853,
              "code": "430624",
              "name": "湘阴县",
              "areacode": "430600"
            },
            {
              "id": 1854,
              "code": "430626",
              "name": "平江县",
              "areacode": "430600"
            },
            {
              "id": 1855,
              "code": "430681",
              "name": "汨罗市",
              "areacode": "430600"
            },
            {
              "id": 1856,
              "code": "430682",
              "name": "临湘市",
              "areacode": "430600"
            }
          ]
        },
        {
          "id": 192,
          "code": "430700",
          "name": "常德市",
          "citycode": "430000",
          "district": [
            {
              "id": 1857,
              "code": "430701",
              "name": "市辖区",
              "areacode": "430700"
            },
            {
              "id": 1858,
              "code": "430702",
              "name": "武陵区",
              "areacode": "430700"
            },
            {
              "id": 1859,
              "code": "430703",
              "name": "鼎城区",
              "areacode": "430700"
            },
            {
              "id": 1860,
              "code": "430721",
              "name": "安乡县",
              "areacode": "430700"
            },
            {
              "id": 1861,
              "code": "430722",
              "name": "汉寿县",
              "areacode": "430700"
            },
            {
              "id": 1862,
              "code": "430723",
              "name": "澧　县",
              "areacode": "430700"
            },
            {
              "id": 1863,
              "code": "430724",
              "name": "临澧县",
              "areacode": "430700"
            },
            {
              "id": 1864,
              "code": "430725",
              "name": "桃源县",
              "areacode": "430700"
            },
            {
              "id": 1865,
              "code": "430726",
              "name": "石门县",
              "areacode": "430700"
            },
            {
              "id": 1866,
              "code": "430781",
              "name": "津市市",
              "areacode": "430700"
            }
          ]
        },
        {
          "id": 193,
          "code": "430800",
          "name": "张家界市",
          "citycode": "430000",
          "district": [
            {
              "id": 1867,
              "code": "430801",
              "name": "市辖区",
              "areacode": "430800"
            },
            {
              "id": 1868,
              "code": "430802",
              "name": "永定区",
              "areacode": "430800"
            },
            {
              "id": 1869,
              "code": "430811",
              "name": "武陵源区",
              "areacode": "430800"
            },
            {
              "id": 1870,
              "code": "430821",
              "name": "慈利县",
              "areacode": "430800"
            },
            {
              "id": 1871,
              "code": "430822",
              "name": "桑植县",
              "areacode": "430800"
            }
          ]
        },
        {
          "id": 194,
          "code": "430900",
          "name": "益阳市",
          "citycode": "430000",
          "district": [
            {
              "id": 1872,
              "code": "430901",
              "name": "市辖区",
              "areacode": "430900"
            },
            {
              "id": 1873,
              "code": "430902",
              "name": "资阳区",
              "areacode": "430900"
            },
            {
              "id": 1874,
              "code": "430903",
              "name": "赫山区",
              "areacode": "430900"
            },
            {
              "id": 1875,
              "code": "430921",
              "name": "南　县",
              "areacode": "430900"
            },
            {
              "id": 1876,
              "code": "430922",
              "name": "桃江县",
              "areacode": "430900"
            },
            {
              "id": 1877,
              "code": "430923",
              "name": "安化县",
              "areacode": "430900"
            },
            {
              "id": 1878,
              "code": "430981",
              "name": "沅江市",
              "areacode": "430900"
            }
          ]
        },
        {
          "id": 195,
          "code": "431000",
          "name": "郴州市",
          "citycode": "430000",
          "district": [
            {
              "id": 1879,
              "code": "431001",
              "name": "市辖区",
              "areacode": "431000"
            },
            {
              "id": 1880,
              "code": "431002",
              "name": "北湖区",
              "areacode": "431000"
            },
            {
              "id": 1881,
              "code": "431003",
              "name": "苏仙区",
              "areacode": "431000"
            },
            {
              "id": 1882,
              "code": "431021",
              "name": "桂阳县",
              "areacode": "431000"
            },
            {
              "id": 1883,
              "code": "431022",
              "name": "宜章县",
              "areacode": "431000"
            },
            {
              "id": 1884,
              "code": "431023",
              "name": "永兴县",
              "areacode": "431000"
            },
            {
              "id": 1885,
              "code": "431024",
              "name": "嘉禾县",
              "areacode": "431000"
            },
            {
              "id": 1886,
              "code": "431025",
              "name": "临武县",
              "areacode": "431000"
            },
            {
              "id": 1887,
              "code": "431026",
              "name": "汝城县",
              "areacode": "431000"
            },
            {
              "id": 1888,
              "code": "431027",
              "name": "桂东县",
              "areacode": "431000"
            },
            {
              "id": 1889,
              "code": "431028",
              "name": "安仁县",
              "areacode": "431000"
            },
            {
              "id": 1890,
              "code": "431081",
              "name": "资兴市",
              "areacode": "431000"
            }
          ]
        },
        {
          "id": 196,
          "code": "431100",
          "name": "永州市",
          "citycode": "430000",
          "district": [
            {
              "id": 1891,
              "code": "431101",
              "name": "市辖区",
              "areacode": "431100"
            },
            {
              "id": 1892,
              "code": "431102",
              "name": "芝山区",
              "areacode": "431100"
            },
            {
              "id": 1893,
              "code": "431103",
              "name": "冷水滩区",
              "areacode": "431100"
            },
            {
              "id": 1894,
              "code": "431121",
              "name": "祁阳县",
              "areacode": "431100"
            },
            {
              "id": 1895,
              "code": "431122",
              "name": "东安县",
              "areacode": "431100"
            },
            {
              "id": 1896,
              "code": "431123",
              "name": "双牌县",
              "areacode": "431100"
            },
            {
              "id": 1897,
              "code": "431124",
              "name": "道　县",
              "areacode": "431100"
            },
            {
              "id": 1898,
              "code": "431125",
              "name": "江永县",
              "areacode": "431100"
            },
            {
              "id": 1899,
              "code": "431126",
              "name": "宁远县",
              "areacode": "431100"
            },
            {
              "id": 1900,
              "code": "431127",
              "name": "蓝山县",
              "areacode": "431100"
            },
            {
              "id": 1901,
              "code": "431128",
              "name": "新田县",
              "areacode": "431100"
            },
            {
              "id": 1902,
              "code": "431129",
              "name": "江华瑶族自治县",
              "areacode": "431100"
            }
          ]
        },
        {
          "id": 197,
          "code": "431200",
          "name": "怀化市",
          "citycode": "430000",
          "district": [
            {
              "id": 1903,
              "code": "431201",
              "name": "市辖区",
              "areacode": "431200"
            },
            {
              "id": 1904,
              "code": "431202",
              "name": "鹤城区",
              "areacode": "431200"
            },
            {
              "id": 1905,
              "code": "431221",
              "name": "中方县",
              "areacode": "431200"
            },
            {
              "id": 1906,
              "code": "431222",
              "name": "沅陵县",
              "areacode": "431200"
            },
            {
              "id": 1907,
              "code": "431223",
              "name": "辰溪县",
              "areacode": "431200"
            },
            {
              "id": 1908,
              "code": "431224",
              "name": "溆浦县",
              "areacode": "431200"
            },
            {
              "id": 1909,
              "code": "431225",
              "name": "会同县",
              "areacode": "431200"
            },
            {
              "id": 1910,
              "code": "431226",
              "name": "麻阳苗族自治县",
              "areacode": "431200"
            },
            {
              "id": 1911,
              "code": "431227",
              "name": "新晃侗族自治县",
              "areacode": "431200"
            },
            {
              "id": 1912,
              "code": "431228",
              "name": "芷江侗族自治县",
              "areacode": "431200"
            },
            {
              "id": 1913,
              "code": "431229",
              "name": "靖州苗族侗族自治县",
              "areacode": "431200"
            },
            {
              "id": 1914,
              "code": "431230",
              "name": "通道侗族自治县",
              "areacode": "431200"
            },
            {
              "id": 1915,
              "code": "431281",
              "name": "洪江市",
              "areacode": "431200"
            }
          ]
        },
        {
          "id": 198,
          "code": "431300",
          "name": "娄底市",
          "citycode": "430000",
          "district": [
            {
              "id": 1916,
              "code": "431301",
              "name": "市辖区",
              "areacode": "431300"
            },
            {
              "id": 1917,
              "code": "431302",
              "name": "娄星区",
              "areacode": "431300"
            },
            {
              "id": 1918,
              "code": "431321",
              "name": "双峰县",
              "areacode": "431300"
            },
            {
              "id": 1919,
              "code": "431322",
              "name": "新化县",
              "areacode": "431300"
            },
            {
              "id": 1920,
              "code": "431381",
              "name": "冷水江市",
              "areacode": "431300"
            },
            {
              "id": 1921,
              "code": "431382",
              "name": "涟源市",
              "areacode": "431300"
            }
          ]
        },
        {
          "id": 199,
          "code": "433100",
          "name": "湘西土家族苗族自治州",
          "citycode": "430000",
          "district": [
            {
              "id": 1922,
              "code": "433101",
              "name": "吉首市",
              "areacode": "433100"
            },
            {
              "id": 1923,
              "code": "433122",
              "name": "泸溪县",
              "areacode": "433100"
            },
            {
              "id": 1924,
              "code": "433123",
              "name": "凤凰县",
              "areacode": "433100"
            },
            {
              "id": 1925,
              "code": "433124",
              "name": "花垣县",
              "areacode": "433100"
            },
            {
              "id": 1926,
              "code": "433125",
              "name": "保靖县",
              "areacode": "433100"
            },
            {
              "id": 1927,
              "code": "433126",
              "name": "古丈县",
              "areacode": "433100"
            },
            {
              "id": 1928,
              "code": "433127",
              "name": "永顺县",
              "areacode": "433100"
            },
            {
              "id": 1929,
              "code": "433130",
              "name": "龙山县",
              "areacode": "433100"
            }
          ]
        }
      ]
    },
    {
      "id": 19,
      "code": "440000",
      "name": "广东省",
      "city": [
        {
          "id": 200,
          "code": "440100",
          "name": "广州市",
          "citycode": "440000",
          "district": [
            {
              "id": 1930,
              "code": "440101",
              "name": "市辖区",
              "areacode": "440100"
            },
            {
              "id": 1931,
              "code": "440102",
              "name": "东山区",
              "areacode": "440100"
            },
            {
              "id": 1932,
              "code": "440103",
              "name": "荔湾区",
              "areacode": "440100"
            },
            {
              "id": 1933,
              "code": "440104",
              "name": "越秀区",
              "areacode": "440100"
            },
            {
              "id": 1934,
              "code": "440105",
              "name": "海珠区",
              "areacode": "440100"
            },
            {
              "id": 1935,
              "code": "440106",
              "name": "天河区",
              "areacode": "440100"
            },
            {
              "id": 1936,
              "code": "440107",
              "name": "芳村区",
              "areacode": "440100"
            },
            {
              "id": 1937,
              "code": "440111",
              "name": "白云区",
              "areacode": "440100"
            },
            {
              "id": 1938,
              "code": "440112",
              "name": "黄埔区",
              "areacode": "440100"
            },
            {
              "id": 1939,
              "code": "440113",
              "name": "番禺区",
              "areacode": "440100"
            },
            {
              "id": 1940,
              "code": "440114",
              "name": "花都区",
              "areacode": "440100"
            },
            {
              "id": 1941,
              "code": "440183",
              "name": "增城市",
              "areacode": "440100"
            },
            {
              "id": 1942,
              "code": "440184",
              "name": "从化市",
              "areacode": "440100"
            }
          ]
        },
        {
          "id": 201,
          "code": "440200",
          "name": "韶关市",
          "citycode": "440000",
          "district": [
            {
              "id": 1943,
              "code": "440201",
              "name": "市辖区",
              "areacode": "440200"
            },
            {
              "id": 1944,
              "code": "440203",
              "name": "武江区",
              "areacode": "440200"
            },
            {
              "id": 1945,
              "code": "440204",
              "name": "浈江区",
              "areacode": "440200"
            },
            {
              "id": 1946,
              "code": "440205",
              "name": "曲江区",
              "areacode": "440200"
            },
            {
              "id": 1947,
              "code": "440222",
              "name": "始兴县",
              "areacode": "440200"
            },
            {
              "id": 1948,
              "code": "440224",
              "name": "仁化县",
              "areacode": "440200"
            },
            {
              "id": 1949,
              "code": "440229",
              "name": "翁源县",
              "areacode": "440200"
            },
            {
              "id": 1950,
              "code": "440232",
              "name": "乳源瑶族自治县",
              "areacode": "440200"
            },
            {
              "id": 1951,
              "code": "440233",
              "name": "新丰县",
              "areacode": "440200"
            },
            {
              "id": 1952,
              "code": "440281",
              "name": "乐昌市",
              "areacode": "440200"
            },
            {
              "id": 1953,
              "code": "440282",
              "name": "南雄市",
              "areacode": "440200"
            }
          ]
        },
        {
          "id": 202,
          "code": "440300",
          "name": "深圳市",
          "citycode": "440000",
          "district": [
            {
              "id": 1954,
              "code": "440301",
              "name": "市辖区",
              "areacode": "440300"
            },
            {
              "id": 1955,
              "code": "440303",
              "name": "罗湖区",
              "areacode": "440300"
            },
            {
              "id": 1956,
              "code": "440304",
              "name": "福田区",
              "areacode": "440300"
            },
            {
              "id": 1957,
              "code": "440305",
              "name": "南山区",
              "areacode": "440300"
            },
            {
              "id": 1958,
              "code": "440306",
              "name": "宝安区",
              "areacode": "440300"
            },
            {
              "id": 1959,
              "code": "440307",
              "name": "龙岗区",
              "areacode": "440300"
            },
            {
              "id": 1960,
              "code": "440308",
              "name": "盐田区",
              "areacode": "440300"
            }
          ]
        },
        {
          "id": 203,
          "code": "440400",
          "name": "珠海市",
          "citycode": "440000",
          "district": [
            {
              "id": 1961,
              "code": "440401",
              "name": "市辖区",
              "areacode": "440400"
            },
            {
              "id": 1962,
              "code": "440402",
              "name": "香洲区",
              "areacode": "440400"
            },
            {
              "id": 1963,
              "code": "440403",
              "name": "斗门区",
              "areacode": "440400"
            },
            {
              "id": 1964,
              "code": "440404",
              "name": "金湾区",
              "areacode": "440400"
            }
          ]
        },
        {
          "id": 204,
          "code": "440500",
          "name": "汕头市",
          "citycode": "440000",
          "district": [
            {
              "id": 1965,
              "code": "440501",
              "name": "市辖区",
              "areacode": "440500"
            },
            {
              "id": 1966,
              "code": "440507",
              "name": "龙湖区",
              "areacode": "440500"
            },
            {
              "id": 1967,
              "code": "440511",
              "name": "金平区",
              "areacode": "440500"
            },
            {
              "id": 1968,
              "code": "440512",
              "name": "濠江区",
              "areacode": "440500"
            },
            {
              "id": 1969,
              "code": "440513",
              "name": "潮阳区",
              "areacode": "440500"
            },
            {
              "id": 1970,
              "code": "440514",
              "name": "潮南区",
              "areacode": "440500"
            },
            {
              "id": 1971,
              "code": "440515",
              "name": "澄海区",
              "areacode": "440500"
            },
            {
              "id": 1972,
              "code": "440523",
              "name": "南澳县",
              "areacode": "440500"
            }
          ]
        },
        {
          "id": 205,
          "code": "440600",
          "name": "佛山市",
          "citycode": "440000",
          "district": [
            {
              "id": 1973,
              "code": "440601",
              "name": "市辖区",
              "areacode": "440600"
            },
            {
              "id": 1974,
              "code": "440604",
              "name": "禅城区",
              "areacode": "440600"
            },
            {
              "id": 1975,
              "code": "440605",
              "name": "南海区",
              "areacode": "440600"
            },
            {
              "id": 1976,
              "code": "440606",
              "name": "顺德区",
              "areacode": "440600"
            },
            {
              "id": 1977,
              "code": "440607",
              "name": "三水区",
              "areacode": "440600"
            },
            {
              "id": 1978,
              "code": "440608",
              "name": "高明区",
              "areacode": "440600"
            }
          ]
        },
        {
          "id": 206,
          "code": "440700",
          "name": "江门市",
          "citycode": "440000",
          "district": [
            {
              "id": 1979,
              "code": "440701",
              "name": "市辖区",
              "areacode": "440700"
            },
            {
              "id": 1980,
              "code": "440703",
              "name": "蓬江区",
              "areacode": "440700"
            },
            {
              "id": 1981,
              "code": "440704",
              "name": "江海区",
              "areacode": "440700"
            },
            {
              "id": 1982,
              "code": "440705",
              "name": "新会区",
              "areacode": "440700"
            },
            {
              "id": 1983,
              "code": "440781",
              "name": "台山市",
              "areacode": "440700"
            },
            {
              "id": 1984,
              "code": "440783",
              "name": "开平市",
              "areacode": "440700"
            },
            {
              "id": 1985,
              "code": "440784",
              "name": "鹤山市",
              "areacode": "440700"
            },
            {
              "id": 1986,
              "code": "440785",
              "name": "恩平市",
              "areacode": "440700"
            }
          ]
        },
        {
          "id": 207,
          "code": "440800",
          "name": "湛江市",
          "citycode": "440000",
          "district": [
            {
              "id": 1987,
              "code": "440801",
              "name": "市辖区",
              "areacode": "440800"
            },
            {
              "id": 1988,
              "code": "440802",
              "name": "赤坎区",
              "areacode": "440800"
            },
            {
              "id": 1989,
              "code": "440803",
              "name": "霞山区",
              "areacode": "440800"
            },
            {
              "id": 1990,
              "code": "440804",
              "name": "坡头区",
              "areacode": "440800"
            },
            {
              "id": 1991,
              "code": "440811",
              "name": "麻章区",
              "areacode": "440800"
            },
            {
              "id": 1992,
              "code": "440823",
              "name": "遂溪县",
              "areacode": "440800"
            },
            {
              "id": 1993,
              "code": "440825",
              "name": "徐闻县",
              "areacode": "440800"
            },
            {
              "id": 1994,
              "code": "440881",
              "name": "廉江市",
              "areacode": "440800"
            },
            {
              "id": 1995,
              "code": "440882",
              "name": "雷州市",
              "areacode": "440800"
            },
            {
              "id": 1996,
              "code": "440883",
              "name": "吴川市",
              "areacode": "440800"
            }
          ]
        },
        {
          "id": 208,
          "code": "440900",
          "name": "茂名市",
          "citycode": "440000",
          "district": [
            {
              "id": 1997,
              "code": "440901",
              "name": "市辖区",
              "areacode": "440900"
            },
            {
              "id": 1998,
              "code": "440902",
              "name": "茂南区",
              "areacode": "440900"
            },
            {
              "id": 1999,
              "code": "440903",
              "name": "茂港区",
              "areacode": "440900"
            },
            {
              "id": 2000,
              "code": "440923",
              "name": "电白县",
              "areacode": "440900"
            },
            {
              "id": 2001,
              "code": "440981",
              "name": "高州市",
              "areacode": "440900"
            },
            {
              "id": 2002,
              "code": "440982",
              "name": "化州市",
              "areacode": "440900"
            },
            {
              "id": 2003,
              "code": "440983",
              "name": "信宜市",
              "areacode": "440900"
            }
          ]
        },
        {
          "id": 209,
          "code": "441200",
          "name": "肇庆市",
          "citycode": "440000",
          "district": [
            {
              "id": 2004,
              "code": "441201",
              "name": "市辖区",
              "areacode": "441200"
            },
            {
              "id": 2005,
              "code": "441202",
              "name": "端州区",
              "areacode": "441200"
            },
            {
              "id": 2006,
              "code": "441203",
              "name": "鼎湖区",
              "areacode": "441200"
            },
            {
              "id": 2007,
              "code": "441223",
              "name": "广宁县",
              "areacode": "441200"
            },
            {
              "id": 2008,
              "code": "441224",
              "name": "怀集县",
              "areacode": "441200"
            },
            {
              "id": 2009,
              "code": "441225",
              "name": "封开县",
              "areacode": "441200"
            },
            {
              "id": 2010,
              "code": "441226",
              "name": "德庆县",
              "areacode": "441200"
            },
            {
              "id": 2011,
              "code": "441283",
              "name": "高要市",
              "areacode": "441200"
            },
            {
              "id": 2012,
              "code": "441284",
              "name": "四会市",
              "areacode": "441200"
            }
          ]
        },
        {
          "id": 210,
          "code": "441300",
          "name": "惠州市",
          "citycode": "440000",
          "district": [
            {
              "id": 2013,
              "code": "441301",
              "name": "市辖区",
              "areacode": "441300"
            },
            {
              "id": 2014,
              "code": "441302",
              "name": "惠城区",
              "areacode": "441300"
            },
            {
              "id": 2015,
              "code": "441303",
              "name": "惠阳区",
              "areacode": "441300"
            },
            {
              "id": 2016,
              "code": "441322",
              "name": "博罗县",
              "areacode": "441300"
            },
            {
              "id": 2017,
              "code": "441323",
              "name": "惠东县",
              "areacode": "441300"
            },
            {
              "id": 2018,
              "code": "441324",
              "name": "龙门县",
              "areacode": "441300"
            }
          ]
        },
        {
          "id": 211,
          "code": "441400",
          "name": "梅州市",
          "citycode": "440000",
          "district": [
            {
              "id": 2019,
              "code": "441401",
              "name": "市辖区",
              "areacode": "441400"
            },
            {
              "id": 2020,
              "code": "441402",
              "name": "梅江区",
              "areacode": "441400"
            },
            {
              "id": 2021,
              "code": "441421",
              "name": "梅　县",
              "areacode": "441400"
            },
            {
              "id": 2022,
              "code": "441422",
              "name": "大埔县",
              "areacode": "441400"
            },
            {
              "id": 2023,
              "code": "441423",
              "name": "丰顺县",
              "areacode": "441400"
            },
            {
              "id": 2024,
              "code": "441424",
              "name": "五华县",
              "areacode": "441400"
            },
            {
              "id": 2025,
              "code": "441426",
              "name": "平远县",
              "areacode": "441400"
            },
            {
              "id": 2026,
              "code": "441427",
              "name": "蕉岭县",
              "areacode": "441400"
            },
            {
              "id": 2027,
              "code": "441481",
              "name": "兴宁市",
              "areacode": "441400"
            }
          ]
        },
        {
          "id": 212,
          "code": "441500",
          "name": "汕尾市",
          "citycode": "440000",
          "district": [
            {
              "id": 2028,
              "code": "441501",
              "name": "市辖区",
              "areacode": "441500"
            },
            {
              "id": 2029,
              "code": "441502",
              "name": "城　区",
              "areacode": "441500"
            },
            {
              "id": 2030,
              "code": "441521",
              "name": "海丰县",
              "areacode": "441500"
            },
            {
              "id": 2031,
              "code": "441523",
              "name": "陆河县",
              "areacode": "441500"
            },
            {
              "id": 2032,
              "code": "441581",
              "name": "陆丰市",
              "areacode": "441500"
            }
          ]
        },
        {
          "id": 213,
          "code": "441600",
          "name": "河源市",
          "citycode": "440000",
          "district": [
            {
              "id": 2033,
              "code": "441601",
              "name": "市辖区",
              "areacode": "441600"
            },
            {
              "id": 2034,
              "code": "441602",
              "name": "源城区",
              "areacode": "441600"
            },
            {
              "id": 2035,
              "code": "441621",
              "name": "紫金县",
              "areacode": "441600"
            },
            {
              "id": 2036,
              "code": "441622",
              "name": "龙川县",
              "areacode": "441600"
            },
            {
              "id": 2037,
              "code": "441623",
              "name": "连平县",
              "areacode": "441600"
            },
            {
              "id": 2038,
              "code": "441624",
              "name": "和平县",
              "areacode": "441600"
            },
            {
              "id": 2039,
              "code": "441625",
              "name": "东源县",
              "areacode": "441600"
            }
          ]
        },
        {
          "id": 214,
          "code": "441700",
          "name": "阳江市",
          "citycode": "440000",
          "district": [
            {
              "id": 2040,
              "code": "441701",
              "name": "市辖区",
              "areacode": "441700"
            },
            {
              "id": 2041,
              "code": "441702",
              "name": "江城区",
              "areacode": "441700"
            },
            {
              "id": 2042,
              "code": "441721",
              "name": "阳西县",
              "areacode": "441700"
            },
            {
              "id": 2043,
              "code": "441723",
              "name": "阳东县",
              "areacode": "441700"
            },
            {
              "id": 2044,
              "code": "441781",
              "name": "阳春市",
              "areacode": "441700"
            }
          ]
        },
        {
          "id": 215,
          "code": "441800",
          "name": "清远市",
          "citycode": "440000",
          "district": [
            {
              "id": 2045,
              "code": "441801",
              "name": "市辖区",
              "areacode": "441800"
            },
            {
              "id": 2046,
              "code": "441802",
              "name": "清城区",
              "areacode": "441800"
            },
            {
              "id": 2047,
              "code": "441821",
              "name": "佛冈县",
              "areacode": "441800"
            },
            {
              "id": 2048,
              "code": "441823",
              "name": "阳山县",
              "areacode": "441800"
            },
            {
              "id": 2049,
              "code": "441825",
              "name": "连山壮族瑶族自治县",
              "areacode": "441800"
            },
            {
              "id": 2050,
              "code": "441826",
              "name": "连南瑶族自治县",
              "areacode": "441800"
            },
            {
              "id": 2051,
              "code": "441827",
              "name": "清新县",
              "areacode": "441800"
            },
            {
              "id": 2052,
              "code": "441881",
              "name": "英德市",
              "areacode": "441800"
            },
            {
              "id": 2053,
              "code": "441882",
              "name": "连州市",
              "areacode": "441800"
            }
          ]
        },
        {
          "id": 216,
          "code": "441900",
          "name": "东莞市",
          "citycode": "440000",
          "district": []
        },
        {
          "id": 217,
          "code": "442000",
          "name": "中山市",
          "citycode": "440000",
          "district": []
        },
        {
          "id": 218,
          "code": "445100",
          "name": "潮州市",
          "citycode": "440000",
          "district": [
            {
              "id": 2054,
              "code": "445101",
              "name": "市辖区",
              "areacode": "445100"
            },
            {
              "id": 2055,
              "code": "445102",
              "name": "湘桥区",
              "areacode": "445100"
            },
            {
              "id": 2056,
              "code": "445121",
              "name": "潮安县",
              "areacode": "445100"
            },
            {
              "id": 2057,
              "code": "445122",
              "name": "饶平县",
              "areacode": "445100"
            }
          ]
        },
        {
          "id": 219,
          "code": "445200",
          "name": "揭阳市",
          "citycode": "440000",
          "district": [
            {
              "id": 2058,
              "code": "445201",
              "name": "市辖区",
              "areacode": "445200"
            },
            {
              "id": 2059,
              "code": "445202",
              "name": "榕城区",
              "areacode": "445200"
            },
            {
              "id": 2060,
              "code": "445221",
              "name": "揭东县",
              "areacode": "445200"
            },
            {
              "id": 2061,
              "code": "445222",
              "name": "揭西县",
              "areacode": "445200"
            },
            {
              "id": 2062,
              "code": "445224",
              "name": "惠来县",
              "areacode": "445200"
            },
            {
              "id": 2063,
              "code": "445281",
              "name": "普宁市",
              "areacode": "445200"
            }
          ]
        },
        {
          "id": 220,
          "code": "445300",
          "name": "云浮市",
          "citycode": "440000",
          "district": [
            {
              "id": 2064,
              "code": "445301",
              "name": "市辖区",
              "areacode": "445300"
            },
            {
              "id": 2065,
              "code": "445302",
              "name": "云城区",
              "areacode": "445300"
            },
            {
              "id": 2066,
              "code": "445321",
              "name": "新兴县",
              "areacode": "445300"
            },
            {
              "id": 2067,
              "code": "445322",
              "name": "郁南县",
              "areacode": "445300"
            },
            {
              "id": 2068,
              "code": "445323",
              "name": "云安县",
              "areacode": "445300"
            },
            {
              "id": 2069,
              "code": "445381",
              "name": "罗定市",
              "areacode": "445300"
            }
          ]
        }
      ]
    },
    {
      "id": 20,
      "code": "450000",
      "name": "广西壮族自治区",
      "city": [
        {
          "id": 221,
          "code": "450100",
          "name": "南宁市",
          "citycode": "450000",
          "district": [
            {
              "id": 2070,
              "code": "450101",
              "name": "市辖区",
              "areacode": "450100"
            },
            {
              "id": 2071,
              "code": "450102",
              "name": "兴宁区",
              "areacode": "450100"
            },
            {
              "id": 2072,
              "code": "450103",
              "name": "青秀区",
              "areacode": "450100"
            },
            {
              "id": 2073,
              "code": "450105",
              "name": "江南区",
              "areacode": "450100"
            },
            {
              "id": 2074,
              "code": "450107",
              "name": "西乡塘区",
              "areacode": "450100"
            },
            {
              "id": 2075,
              "code": "450108",
              "name": "良庆区",
              "areacode": "450100"
            },
            {
              "id": 2076,
              "code": "450109",
              "name": "邕宁区",
              "areacode": "450100"
            },
            {
              "id": 2077,
              "code": "450122",
              "name": "武鸣县",
              "areacode": "450100"
            },
            {
              "id": 2078,
              "code": "450123",
              "name": "隆安县",
              "areacode": "450100"
            },
            {
              "id": 2079,
              "code": "450124",
              "name": "马山县",
              "areacode": "450100"
            },
            {
              "id": 2080,
              "code": "450125",
              "name": "上林县",
              "areacode": "450100"
            },
            {
              "id": 2081,
              "code": "450126",
              "name": "宾阳县",
              "areacode": "450100"
            },
            {
              "id": 2082,
              "code": "450127",
              "name": "横　县",
              "areacode": "450100"
            }
          ]
        },
        {
          "id": 222,
          "code": "450200",
          "name": "柳州市",
          "citycode": "450000",
          "district": [
            {
              "id": 2083,
              "code": "450201",
              "name": "市辖区",
              "areacode": "450200"
            },
            {
              "id": 2084,
              "code": "450202",
              "name": "城中区",
              "areacode": "450200"
            },
            {
              "id": 2085,
              "code": "450203",
              "name": "鱼峰区",
              "areacode": "450200"
            },
            {
              "id": 2086,
              "code": "450204",
              "name": "柳南区",
              "areacode": "450200"
            },
            {
              "id": 2087,
              "code": "450205",
              "name": "柳北区",
              "areacode": "450200"
            },
            {
              "id": 2088,
              "code": "450221",
              "name": "柳江县",
              "areacode": "450200"
            },
            {
              "id": 2089,
              "code": "450222",
              "name": "柳城县",
              "areacode": "450200"
            },
            {
              "id": 2090,
              "code": "450223",
              "name": "鹿寨县",
              "areacode": "450200"
            },
            {
              "id": 2091,
              "code": "450224",
              "name": "融安县",
              "areacode": "450200"
            },
            {
              "id": 2092,
              "code": "450225",
              "name": "融水苗族自治县",
              "areacode": "450200"
            },
            {
              "id": 2093,
              "code": "450226",
              "name": "三江侗族自治县",
              "areacode": "450200"
            }
          ]
        },
        {
          "id": 223,
          "code": "450300",
          "name": "桂林市",
          "citycode": "450000",
          "district": [
            {
              "id": 2094,
              "code": "450301",
              "name": "市辖区",
              "areacode": "450300"
            },
            {
              "id": 2095,
              "code": "450302",
              "name": "秀峰区",
              "areacode": "450300"
            },
            {
              "id": 2096,
              "code": "450303",
              "name": "叠彩区",
              "areacode": "450300"
            },
            {
              "id": 2097,
              "code": "450304",
              "name": "象山区",
              "areacode": "450300"
            },
            {
              "id": 2098,
              "code": "450305",
              "name": "七星区",
              "areacode": "450300"
            },
            {
              "id": 2099,
              "code": "450311",
              "name": "雁山区",
              "areacode": "450300"
            },
            {
              "id": 2100,
              "code": "450321",
              "name": "阳朔县",
              "areacode": "450300"
            },
            {
              "id": 2101,
              "code": "450322",
              "name": "临桂县",
              "areacode": "450300"
            },
            {
              "id": 2102,
              "code": "450323",
              "name": "灵川县",
              "areacode": "450300"
            },
            {
              "id": 2103,
              "code": "450324",
              "name": "全州县",
              "areacode": "450300"
            },
            {
              "id": 2104,
              "code": "450325",
              "name": "兴安县",
              "areacode": "450300"
            },
            {
              "id": 2105,
              "code": "450326",
              "name": "永福县",
              "areacode": "450300"
            },
            {
              "id": 2106,
              "code": "450327",
              "name": "灌阳县",
              "areacode": "450300"
            },
            {
              "id": 2107,
              "code": "450328",
              "name": "龙胜各族自治县",
              "areacode": "450300"
            },
            {
              "id": 2108,
              "code": "450329",
              "name": "资源县",
              "areacode": "450300"
            },
            {
              "id": 2109,
              "code": "450330",
              "name": "平乐县",
              "areacode": "450300"
            },
            {
              "id": 2110,
              "code": "450331",
              "name": "荔蒲县",
              "areacode": "450300"
            },
            {
              "id": 2111,
              "code": "450332",
              "name": "恭城瑶族自治县",
              "areacode": "450300"
            }
          ]
        },
        {
          "id": 224,
          "code": "450400",
          "name": "梧州市",
          "citycode": "450000",
          "district": [
            {
              "id": 2112,
              "code": "450401",
              "name": "市辖区",
              "areacode": "450400"
            },
            {
              "id": 2113,
              "code": "450403",
              "name": "万秀区",
              "areacode": "450400"
            },
            {
              "id": 2114,
              "code": "450404",
              "name": "蝶山区",
              "areacode": "450400"
            },
            {
              "id": 2115,
              "code": "450405",
              "name": "长洲区",
              "areacode": "450400"
            },
            {
              "id": 2116,
              "code": "450421",
              "name": "苍梧县",
              "areacode": "450400"
            },
            {
              "id": 2117,
              "code": "450422",
              "name": "藤　县",
              "areacode": "450400"
            },
            {
              "id": 2118,
              "code": "450423",
              "name": "蒙山县",
              "areacode": "450400"
            },
            {
              "id": 2119,
              "code": "450481",
              "name": "岑溪市",
              "areacode": "450400"
            }
          ]
        },
        {
          "id": 225,
          "code": "450500",
          "name": "北海市",
          "citycode": "450000",
          "district": [
            {
              "id": 2120,
              "code": "450501",
              "name": "市辖区",
              "areacode": "450500"
            },
            {
              "id": 2121,
              "code": "450502",
              "name": "海城区",
              "areacode": "450500"
            },
            {
              "id": 2122,
              "code": "450503",
              "name": "银海区",
              "areacode": "450500"
            },
            {
              "id": 2123,
              "code": "450512",
              "name": "铁山港区",
              "areacode": "450500"
            },
            {
              "id": 2124,
              "code": "450521",
              "name": "合浦县",
              "areacode": "450500"
            }
          ]
        },
        {
          "id": 226,
          "code": "450600",
          "name": "防城港市",
          "citycode": "450000",
          "district": [
            {
              "id": 2125,
              "code": "450601",
              "name": "市辖区",
              "areacode": "450600"
            },
            {
              "id": 2126,
              "code": "450602",
              "name": "港口区",
              "areacode": "450600"
            },
            {
              "id": 2127,
              "code": "450603",
              "name": "防城区",
              "areacode": "450600"
            },
            {
              "id": 2128,
              "code": "450621",
              "name": "上思县",
              "areacode": "450600"
            },
            {
              "id": 2129,
              "code": "450681",
              "name": "东兴市",
              "areacode": "450600"
            }
          ]
        },
        {
          "id": 227,
          "code": "450700",
          "name": "钦州市",
          "citycode": "450000",
          "district": [
            {
              "id": 2130,
              "code": "450701",
              "name": "市辖区",
              "areacode": "450700"
            },
            {
              "id": 2131,
              "code": "450702",
              "name": "钦南区",
              "areacode": "450700"
            },
            {
              "id": 2132,
              "code": "450703",
              "name": "钦北区",
              "areacode": "450700"
            },
            {
              "id": 2133,
              "code": "450721",
              "name": "灵山县",
              "areacode": "450700"
            },
            {
              "id": 2134,
              "code": "450722",
              "name": "浦北县",
              "areacode": "450700"
            }
          ]
        },
        {
          "id": 228,
          "code": "450800",
          "name": "贵港市",
          "citycode": "450000",
          "district": [
            {
              "id": 2135,
              "code": "450801",
              "name": "市辖区",
              "areacode": "450800"
            },
            {
              "id": 2136,
              "code": "450802",
              "name": "港北区",
              "areacode": "450800"
            },
            {
              "id": 2137,
              "code": "450803",
              "name": "港南区",
              "areacode": "450800"
            },
            {
              "id": 2138,
              "code": "450804",
              "name": "覃塘区",
              "areacode": "450800"
            },
            {
              "id": 2139,
              "code": "450821",
              "name": "平南县",
              "areacode": "450800"
            },
            {
              "id": 2140,
              "code": "450881",
              "name": "桂平市",
              "areacode": "450800"
            }
          ]
        },
        {
          "id": 229,
          "code": "450900",
          "name": "玉林市",
          "citycode": "450000",
          "district": [
            {
              "id": 2141,
              "code": "450901",
              "name": "市辖区",
              "areacode": "450900"
            },
            {
              "id": 2142,
              "code": "450902",
              "name": "玉州区",
              "areacode": "450900"
            },
            {
              "id": 2143,
              "code": "450921",
              "name": "容　县",
              "areacode": "450900"
            },
            {
              "id": 2144,
              "code": "450922",
              "name": "陆川县",
              "areacode": "450900"
            },
            {
              "id": 2145,
              "code": "450923",
              "name": "博白县",
              "areacode": "450900"
            },
            {
              "id": 2146,
              "code": "450924",
              "name": "兴业县",
              "areacode": "450900"
            },
            {
              "id": 2147,
              "code": "450981",
              "name": "北流市",
              "areacode": "450900"
            }
          ]
        },
        {
          "id": 230,
          "code": "451000",
          "name": "百色市",
          "citycode": "450000",
          "district": [
            {
              "id": 2148,
              "code": "451001",
              "name": "市辖区",
              "areacode": "451000"
            },
            {
              "id": 2149,
              "code": "451002",
              "name": "右江区",
              "areacode": "451000"
            },
            {
              "id": 2150,
              "code": "451021",
              "name": "田阳县",
              "areacode": "451000"
            },
            {
              "id": 2151,
              "code": "451022",
              "name": "田东县",
              "areacode": "451000"
            },
            {
              "id": 2152,
              "code": "451023",
              "name": "平果县",
              "areacode": "451000"
            },
            {
              "id": 2153,
              "code": "451024",
              "name": "德保县",
              "areacode": "451000"
            },
            {
              "id": 2154,
              "code": "451025",
              "name": "靖西县",
              "areacode": "451000"
            },
            {
              "id": 2155,
              "code": "451026",
              "name": "那坡县",
              "areacode": "451000"
            },
            {
              "id": 2156,
              "code": "451027",
              "name": "凌云县",
              "areacode": "451000"
            },
            {
              "id": 2157,
              "code": "451028",
              "name": "乐业县",
              "areacode": "451000"
            },
            {
              "id": 2158,
              "code": "451029",
              "name": "田林县",
              "areacode": "451000"
            },
            {
              "id": 2159,
              "code": "451030",
              "name": "西林县",
              "areacode": "451000"
            },
            {
              "id": 2160,
              "code": "451031",
              "name": "隆林各族自治县",
              "areacode": "451000"
            }
          ]
        },
        {
          "id": 231,
          "code": "451100",
          "name": "贺州市",
          "citycode": "450000",
          "district": [
            {
              "id": 2161,
              "code": "451101",
              "name": "市辖区",
              "areacode": "451100"
            },
            {
              "id": 2162,
              "code": "451102",
              "name": "八步区",
              "areacode": "451100"
            },
            {
              "id": 2163,
              "code": "451121",
              "name": "昭平县",
              "areacode": "451100"
            },
            {
              "id": 2164,
              "code": "451122",
              "name": "钟山县",
              "areacode": "451100"
            },
            {
              "id": 2165,
              "code": "451123",
              "name": "富川瑶族自治县",
              "areacode": "451100"
            }
          ]
        },
        {
          "id": 232,
          "code": "451200",
          "name": "河池市",
          "citycode": "450000",
          "district": [
            {
              "id": 2166,
              "code": "451201",
              "name": "市辖区",
              "areacode": "451200"
            },
            {
              "id": 2167,
              "code": "451202",
              "name": "金城江区",
              "areacode": "451200"
            },
            {
              "id": 2168,
              "code": "451221",
              "name": "南丹县",
              "areacode": "451200"
            },
            {
              "id": 2169,
              "code": "451222",
              "name": "天峨县",
              "areacode": "451200"
            },
            {
              "id": 2170,
              "code": "451223",
              "name": "凤山县",
              "areacode": "451200"
            },
            {
              "id": 2171,
              "code": "451224",
              "name": "东兰县",
              "areacode": "451200"
            },
            {
              "id": 2172,
              "code": "451225",
              "name": "罗城仫佬族自治县",
              "areacode": "451200"
            },
            {
              "id": 2173,
              "code": "451226",
              "name": "环江毛南族自治县",
              "areacode": "451200"
            },
            {
              "id": 2174,
              "code": "451227",
              "name": "巴马瑶族自治县",
              "areacode": "451200"
            },
            {
              "id": 2175,
              "code": "451228",
              "name": "都安瑶族自治县",
              "areacode": "451200"
            },
            {
              "id": 2176,
              "code": "451229",
              "name": "大化瑶族自治县",
              "areacode": "451200"
            },
            {
              "id": 2177,
              "code": "451281",
              "name": "宜州市",
              "areacode": "451200"
            }
          ]
        },
        {
          "id": 233,
          "code": "451300",
          "name": "来宾市",
          "citycode": "450000",
          "district": [
            {
              "id": 2178,
              "code": "451301",
              "name": "市辖区",
              "areacode": "451300"
            },
            {
              "id": 2179,
              "code": "451302",
              "name": "兴宾区",
              "areacode": "451300"
            },
            {
              "id": 2180,
              "code": "451321",
              "name": "忻城县",
              "areacode": "451300"
            },
            {
              "id": 2181,
              "code": "451322",
              "name": "象州县",
              "areacode": "451300"
            },
            {
              "id": 2182,
              "code": "451323",
              "name": "武宣县",
              "areacode": "451300"
            },
            {
              "id": 2183,
              "code": "451324",
              "name": "金秀瑶族自治县",
              "areacode": "451300"
            },
            {
              "id": 2184,
              "code": "451381",
              "name": "合山市",
              "areacode": "451300"
            }
          ]
        },
        {
          "id": 234,
          "code": "451400",
          "name": "崇左市",
          "citycode": "450000",
          "district": [
            {
              "id": 2185,
              "code": "451401",
              "name": "市辖区",
              "areacode": "451400"
            },
            {
              "id": 2186,
              "code": "451402",
              "name": "江洲区",
              "areacode": "451400"
            },
            {
              "id": 2187,
              "code": "451421",
              "name": "扶绥县",
              "areacode": "451400"
            },
            {
              "id": 2188,
              "code": "451422",
              "name": "宁明县",
              "areacode": "451400"
            },
            {
              "id": 2189,
              "code": "451423",
              "name": "龙州县",
              "areacode": "451400"
            },
            {
              "id": 2190,
              "code": "451424",
              "name": "大新县",
              "areacode": "451400"
            },
            {
              "id": 2191,
              "code": "451425",
              "name": "天等县",
              "areacode": "451400"
            },
            {
              "id": 2192,
              "code": "451481",
              "name": "凭祥市",
              "areacode": "451400"
            }
          ]
        }
      ]
    },
    {
      "id": 21,
      "code": "460000",
      "name": "海南省",
      "city": [
        {
          "id": 235,
          "code": "460100",
          "name": "海口市",
          "citycode": "460000",
          "district": [
            {
              "id": 2193,
              "code": "460101",
              "name": "市辖区",
              "areacode": "460100"
            },
            {
              "id": 2194,
              "code": "460105",
              "name": "秀英区",
              "areacode": "460100"
            },
            {
              "id": 2195,
              "code": "460106",
              "name": "龙华区",
              "areacode": "460100"
            },
            {
              "id": 2196,
              "code": "460107",
              "name": "琼山区",
              "areacode": "460100"
            },
            {
              "id": 2197,
              "code": "460108",
              "name": "美兰区",
              "areacode": "460100"
            }
          ]
        },
        {
          "id": 236,
          "code": "460200",
          "name": "三亚市",
          "citycode": "460000",
          "district": [
            {
              "id": 2198,
              "code": "460201",
              "name": "市辖区",
              "areacode": "460200"
            }
          ]
        },
        {
          "id": 237,
          "code": "469000",
          "name": "省直辖县级行政单位",
          "citycode": "460000",
          "district": [
            {
              "id": 2199,
              "code": "469001",
              "name": "五指山市",
              "areacode": "469000"
            },
            {
              "id": 2200,
              "code": "469002",
              "name": "琼海市",
              "areacode": "469000"
            },
            {
              "id": 2201,
              "code": "469003",
              "name": "儋州市",
              "areacode": "469000"
            },
            {
              "id": 2202,
              "code": "469005",
              "name": "文昌市",
              "areacode": "469000"
            },
            {
              "id": 2203,
              "code": "469006",
              "name": "万宁市",
              "areacode": "469000"
            },
            {
              "id": 2204,
              "code": "469007",
              "name": "东方市",
              "areacode": "469000"
            },
            {
              "id": 2205,
              "code": "469025",
              "name": "定安县",
              "areacode": "469000"
            },
            {
              "id": 2206,
              "code": "469026",
              "name": "屯昌县",
              "areacode": "469000"
            },
            {
              "id": 2207,
              "code": "469027",
              "name": "澄迈县",
              "areacode": "469000"
            },
            {
              "id": 2208,
              "code": "469028",
              "name": "临高县",
              "areacode": "469000"
            },
            {
              "id": 2209,
              "code": "469030",
              "name": "白沙黎族自治县",
              "areacode": "469000"
            },
            {
              "id": 2210,
              "code": "469031",
              "name": "昌江黎族自治县",
              "areacode": "469000"
            },
            {
              "id": 2211,
              "code": "469033",
              "name": "乐东黎族自治县",
              "areacode": "469000"
            },
            {
              "id": 2212,
              "code": "469034",
              "name": "陵水黎族自治县",
              "areacode": "469000"
            },
            {
              "id": 2213,
              "code": "469035",
              "name": "保亭黎族苗族自治县",
              "areacode": "469000"
            },
            {
              "id": 2214,
              "code": "469036",
              "name": "琼中黎族苗族自治县",
              "areacode": "469000"
            },
            {
              "id": 2215,
              "code": "469037",
              "name": "西沙群岛",
              "areacode": "469000"
            },
            {
              "id": 2216,
              "code": "469038",
              "name": "南沙群岛",
              "areacode": "469000"
            },
            {
              "id": 2217,
              "code": "469039",
              "name": "中沙群岛的岛礁及其海域",
              "areacode": "469000"
            }
          ]
        }
      ]
    },
    {
      "id": 22,
      "code": "500000",
      "name": "重庆市",
      "city": [
        {
          "id": 238,
          "code": "500100",
          "name": "市辖区",
          "citycode": "500000",
          "district": [
            {
              "id": 2218,
              "code": "500101",
              "name": "万州区",
              "areacode": "500100"
            },
            {
              "id": 2219,
              "code": "500102",
              "name": "涪陵区",
              "areacode": "500100"
            },
            {
              "id": 2220,
              "code": "500103",
              "name": "渝中区",
              "areacode": "500100"
            },
            {
              "id": 2221,
              "code": "500104",
              "name": "大渡口区",
              "areacode": "500100"
            },
            {
              "id": 2222,
              "code": "500105",
              "name": "江北区",
              "areacode": "500100"
            },
            {
              "id": 2223,
              "code": "500106",
              "name": "沙坪坝区",
              "areacode": "500100"
            },
            {
              "id": 2224,
              "code": "500107",
              "name": "九龙坡区",
              "areacode": "500100"
            },
            {
              "id": 2225,
              "code": "500108",
              "name": "南岸区",
              "areacode": "500100"
            },
            {
              "id": 2226,
              "code": "500109",
              "name": "北碚区",
              "areacode": "500100"
            },
            {
              "id": 2227,
              "code": "500110",
              "name": "万盛区",
              "areacode": "500100"
            },
            {
              "id": 2228,
              "code": "500111",
              "name": "双桥区",
              "areacode": "500100"
            },
            {
              "id": 2229,
              "code": "500112",
              "name": "渝北区",
              "areacode": "500100"
            },
            {
              "id": 2230,
              "code": "500113",
              "name": "巴南区",
              "areacode": "500100"
            },
            {
              "id": 2231,
              "code": "500114",
              "name": "黔江区",
              "areacode": "500100"
            },
            {
              "id": 2232,
              "code": "500115",
              "name": "长寿区",
              "areacode": "500100"
            }
          ]
        },
        {
          "id": 239,
          "code": "500200",
          "name": "县",
          "citycode": "500000",
          "district": [
            {
              "id": 2233,
              "code": "500222",
              "name": "綦江县",
              "areacode": "500200"
            },
            {
              "id": 2234,
              "code": "500223",
              "name": "潼南县",
              "areacode": "500200"
            },
            {
              "id": 2235,
              "code": "500224",
              "name": "铜梁县",
              "areacode": "500200"
            },
            {
              "id": 2236,
              "code": "500225",
              "name": "大足县",
              "areacode": "500200"
            },
            {
              "id": 2237,
              "code": "500226",
              "name": "荣昌县",
              "areacode": "500200"
            },
            {
              "id": 2238,
              "code": "500227",
              "name": "璧山县",
              "areacode": "500200"
            },
            {
              "id": 2239,
              "code": "500228",
              "name": "梁平县",
              "areacode": "500200"
            },
            {
              "id": 2240,
              "code": "500229",
              "name": "城口县",
              "areacode": "500200"
            },
            {
              "id": 2241,
              "code": "500230",
              "name": "丰都县",
              "areacode": "500200"
            },
            {
              "id": 2242,
              "code": "500231",
              "name": "垫江县",
              "areacode": "500200"
            },
            {
              "id": 2243,
              "code": "500232",
              "name": "武隆县",
              "areacode": "500200"
            },
            {
              "id": 2244,
              "code": "500233",
              "name": "忠　县",
              "areacode": "500200"
            },
            {
              "id": 2245,
              "code": "500234",
              "name": "开　县",
              "areacode": "500200"
            },
            {
              "id": 2246,
              "code": "500235",
              "name": "云阳县",
              "areacode": "500200"
            },
            {
              "id": 2247,
              "code": "500236",
              "name": "奉节县",
              "areacode": "500200"
            },
            {
              "id": 2248,
              "code": "500237",
              "name": "巫山县",
              "areacode": "500200"
            },
            {
              "id": 2249,
              "code": "500238",
              "name": "巫溪县",
              "areacode": "500200"
            },
            {
              "id": 2250,
              "code": "500240",
              "name": "石柱土家族自治县",
              "areacode": "500200"
            },
            {
              "id": 2251,
              "code": "500241",
              "name": "秀山土家族苗族自治县",
              "areacode": "500200"
            },
            {
              "id": 2252,
              "code": "500242",
              "name": "酉阳土家族苗族自治县",
              "areacode": "500200"
            },
            {
              "id": 2253,
              "code": "500243",
              "name": "彭水苗族土家族自治县",
              "areacode": "500200"
            }
          ]
        },
        {
          "id": 240,
          "code": "500300",
          "name": "市",
          "citycode": "500000",
          "district": [
            {
              "id": 2254,
              "code": "500381",
              "name": "江津市",
              "areacode": "500300"
            },
            {
              "id": 2255,
              "code": "500382",
              "name": "合川市",
              "areacode": "500300"
            },
            {
              "id": 2256,
              "code": "500383",
              "name": "永川市",
              "areacode": "500300"
            },
            {
              "id": 2257,
              "code": "500384",
              "name": "南川市",
              "areacode": "500300"
            }
          ]
        }
      ]
    },
    {
      "id": 23,
      "code": "510000",
      "name": "四川省",
      "city": [
        {
          "id": 241,
          "code": "510100",
          "name": "成都市",
          "citycode": "510000",
          "district": [
            {
              "id": 2258,
              "code": "510101",
              "name": "市辖区",
              "areacode": "510100"
            },
            {
              "id": 2259,
              "code": "510104",
              "name": "锦江区",
              "areacode": "510100"
            },
            {
              "id": 2260,
              "code": "510105",
              "name": "青羊区",
              "areacode": "510100"
            },
            {
              "id": 2261,
              "code": "510106",
              "name": "金牛区",
              "areacode": "510100"
            },
            {
              "id": 2262,
              "code": "510107",
              "name": "武侯区",
              "areacode": "510100"
            },
            {
              "id": 2263,
              "code": "510108",
              "name": "成华区",
              "areacode": "510100"
            },
            {
              "id": 2264,
              "code": "510112",
              "name": "龙泉驿区",
              "areacode": "510100"
            },
            {
              "id": 2265,
              "code": "510113",
              "name": "青白江区",
              "areacode": "510100"
            },
            {
              "id": 2266,
              "code": "510114",
              "name": "新都区",
              "areacode": "510100"
            },
            {
              "id": 2267,
              "code": "510115",
              "name": "温江县",
              "areacode": "510100"
            },
            {
              "id": 2268,
              "code": "510121",
              "name": "金堂县",
              "areacode": "510100"
            },
            {
              "id": 2269,
              "code": "510122",
              "name": "双流县",
              "areacode": "510100"
            },
            {
              "id": 2270,
              "code": "510124",
              "name": "郫　县",
              "areacode": "510100"
            },
            {
              "id": 2271,
              "code": "510129",
              "name": "大邑县",
              "areacode": "510100"
            },
            {
              "id": 2272,
              "code": "510131",
              "name": "蒲江县",
              "areacode": "510100"
            },
            {
              "id": 2273,
              "code": "510132",
              "name": "新津县",
              "areacode": "510100"
            },
            {
              "id": 2274,
              "code": "510181",
              "name": "都江堰市",
              "areacode": "510100"
            },
            {
              "id": 2275,
              "code": "510182",
              "name": "彭州市",
              "areacode": "510100"
            },
            {
              "id": 2276,
              "code": "510183",
              "name": "邛崃市",
              "areacode": "510100"
            },
            {
              "id": 2277,
              "code": "510184",
              "name": "崇州市",
              "areacode": "510100"
            }
          ]
        },
        {
          "id": 242,
          "code": "510300",
          "name": "自贡市",
          "citycode": "510000",
          "district": [
            {
              "id": 2278,
              "code": "510301",
              "name": "市辖区",
              "areacode": "510300"
            },
            {
              "id": 2279,
              "code": "510302",
              "name": "自流井区",
              "areacode": "510300"
            },
            {
              "id": 2280,
              "code": "510303",
              "name": "贡井区",
              "areacode": "510300"
            },
            {
              "id": 2281,
              "code": "510304",
              "name": "大安区",
              "areacode": "510300"
            },
            {
              "id": 2282,
              "code": "510311",
              "name": "沿滩区",
              "areacode": "510300"
            },
            {
              "id": 2283,
              "code": "510321",
              "name": "荣　县",
              "areacode": "510300"
            },
            {
              "id": 2284,
              "code": "510322",
              "name": "富顺县",
              "areacode": "510300"
            }
          ]
        },
        {
          "id": 243,
          "code": "510400",
          "name": "攀枝花市",
          "citycode": "510000",
          "district": [
            {
              "id": 2285,
              "code": "510401",
              "name": "市辖区",
              "areacode": "510400"
            },
            {
              "id": 2286,
              "code": "510402",
              "name": "东　区",
              "areacode": "510400"
            },
            {
              "id": 2287,
              "code": "510403",
              "name": "西　区",
              "areacode": "510400"
            },
            {
              "id": 2288,
              "code": "510411",
              "name": "仁和区",
              "areacode": "510400"
            },
            {
              "id": 2289,
              "code": "510421",
              "name": "米易县",
              "areacode": "510400"
            },
            {
              "id": 2290,
              "code": "510422",
              "name": "盐边县",
              "areacode": "510400"
            }
          ]
        },
        {
          "id": 244,
          "code": "510500",
          "name": "泸州市",
          "citycode": "510000",
          "district": [
            {
              "id": 2291,
              "code": "510501",
              "name": "市辖区",
              "areacode": "510500"
            },
            {
              "id": 2292,
              "code": "510502",
              "name": "江阳区",
              "areacode": "510500"
            },
            {
              "id": 2293,
              "code": "510503",
              "name": "纳溪区",
              "areacode": "510500"
            },
            {
              "id": 2294,
              "code": "510504",
              "name": "龙马潭区",
              "areacode": "510500"
            },
            {
              "id": 2295,
              "code": "510521",
              "name": "泸　县",
              "areacode": "510500"
            },
            {
              "id": 2296,
              "code": "510522",
              "name": "合江县",
              "areacode": "510500"
            },
            {
              "id": 2297,
              "code": "510524",
              "name": "叙永县",
              "areacode": "510500"
            },
            {
              "id": 2298,
              "code": "510525",
              "name": "古蔺县",
              "areacode": "510500"
            }
          ]
        },
        {
          "id": 245,
          "code": "510600",
          "name": "德阳市",
          "citycode": "510000",
          "district": [
            {
              "id": 2299,
              "code": "510601",
              "name": "市辖区",
              "areacode": "510600"
            },
            {
              "id": 2300,
              "code": "510603",
              "name": "旌阳区",
              "areacode": "510600"
            },
            {
              "id": 2301,
              "code": "510623",
              "name": "中江县",
              "areacode": "510600"
            },
            {
              "id": 2302,
              "code": "510626",
              "name": "罗江县",
              "areacode": "510600"
            },
            {
              "id": 2303,
              "code": "510681",
              "name": "广汉市",
              "areacode": "510600"
            },
            {
              "id": 2304,
              "code": "510682",
              "name": "什邡市",
              "areacode": "510600"
            },
            {
              "id": 2305,
              "code": "510683",
              "name": "绵竹市",
              "areacode": "510600"
            }
          ]
        },
        {
          "id": 246,
          "code": "510700",
          "name": "绵阳市",
          "citycode": "510000",
          "district": [
            {
              "id": 2306,
              "code": "510701",
              "name": "市辖区",
              "areacode": "510700"
            },
            {
              "id": 2307,
              "code": "510703",
              "name": "涪城区",
              "areacode": "510700"
            },
            {
              "id": 2308,
              "code": "510704",
              "name": "游仙区",
              "areacode": "510700"
            },
            {
              "id": 2309,
              "code": "510722",
              "name": "三台县",
              "areacode": "510700"
            },
            {
              "id": 2310,
              "code": "510723",
              "name": "盐亭县",
              "areacode": "510700"
            },
            {
              "id": 2311,
              "code": "510724",
              "name": "安　县",
              "areacode": "510700"
            },
            {
              "id": 2312,
              "code": "510725",
              "name": "梓潼县",
              "areacode": "510700"
            },
            {
              "id": 2313,
              "code": "510726",
              "name": "北川羌族自治县",
              "areacode": "510700"
            },
            {
              "id": 2314,
              "code": "510727",
              "name": "平武县",
              "areacode": "510700"
            },
            {
              "id": 2315,
              "code": "510781",
              "name": "江油市",
              "areacode": "510700"
            }
          ]
        },
        {
          "id": 247,
          "code": "510800",
          "name": "广元市",
          "citycode": "510000",
          "district": [
            {
              "id": 2316,
              "code": "510801",
              "name": "市辖区",
              "areacode": "510800"
            },
            {
              "id": 2317,
              "code": "510802",
              "name": "市中区",
              "areacode": "510800"
            },
            {
              "id": 2318,
              "code": "510811",
              "name": "元坝区",
              "areacode": "510800"
            },
            {
              "id": 2319,
              "code": "510812",
              "name": "朝天区",
              "areacode": "510800"
            },
            {
              "id": 2320,
              "code": "510821",
              "name": "旺苍县",
              "areacode": "510800"
            },
            {
              "id": 2321,
              "code": "510822",
              "name": "青川县",
              "areacode": "510800"
            },
            {
              "id": 2322,
              "code": "510823",
              "name": "剑阁县",
              "areacode": "510800"
            },
            {
              "id": 2323,
              "code": "510824",
              "name": "苍溪县",
              "areacode": "510800"
            }
          ]
        },
        {
          "id": 248,
          "code": "510900",
          "name": "遂宁市",
          "citycode": "510000",
          "district": [
            {
              "id": 2324,
              "code": "510901",
              "name": "市辖区",
              "areacode": "510900"
            },
            {
              "id": 2325,
              "code": "510903",
              "name": "船山区",
              "areacode": "510900"
            },
            {
              "id": 2326,
              "code": "510904",
              "name": "安居区",
              "areacode": "510900"
            },
            {
              "id": 2327,
              "code": "510921",
              "name": "蓬溪县",
              "areacode": "510900"
            },
            {
              "id": 2328,
              "code": "510922",
              "name": "射洪县",
              "areacode": "510900"
            },
            {
              "id": 2329,
              "code": "510923",
              "name": "大英县",
              "areacode": "510900"
            }
          ]
        },
        {
          "id": 249,
          "code": "511000",
          "name": "内江市",
          "citycode": "510000",
          "district": [
            {
              "id": 2330,
              "code": "511001",
              "name": "市辖区",
              "areacode": "511000"
            },
            {
              "id": 2331,
              "code": "511002",
              "name": "市中区",
              "areacode": "511000"
            },
            {
              "id": 2332,
              "code": "511011",
              "name": "东兴区",
              "areacode": "511000"
            },
            {
              "id": 2333,
              "code": "511024",
              "name": "威远县",
              "areacode": "511000"
            },
            {
              "id": 2334,
              "code": "511025",
              "name": "资中县",
              "areacode": "511000"
            },
            {
              "id": 2335,
              "code": "511028",
              "name": "隆昌县",
              "areacode": "511000"
            }
          ]
        },
        {
          "id": 250,
          "code": "511100",
          "name": "乐山市",
          "citycode": "510000",
          "district": [
            {
              "id": 2336,
              "code": "511101",
              "name": "市辖区",
              "areacode": "511100"
            },
            {
              "id": 2337,
              "code": "511102",
              "name": "市中区",
              "areacode": "511100"
            },
            {
              "id": 2338,
              "code": "511111",
              "name": "沙湾区",
              "areacode": "511100"
            },
            {
              "id": 2339,
              "code": "511112",
              "name": "五通桥区",
              "areacode": "511100"
            },
            {
              "id": 2340,
              "code": "511113",
              "name": "金口河区",
              "areacode": "511100"
            },
            {
              "id": 2341,
              "code": "511123",
              "name": "犍为县",
              "areacode": "511100"
            },
            {
              "id": 2342,
              "code": "511124",
              "name": "井研县",
              "areacode": "511100"
            },
            {
              "id": 2343,
              "code": "511126",
              "name": "夹江县",
              "areacode": "511100"
            },
            {
              "id": 2344,
              "code": "511129",
              "name": "沐川县",
              "areacode": "511100"
            },
            {
              "id": 2345,
              "code": "511132",
              "name": "峨边彝族自治县",
              "areacode": "511100"
            },
            {
              "id": 2346,
              "code": "511133",
              "name": "马边彝族自治县",
              "areacode": "511100"
            },
            {
              "id": 2347,
              "code": "511181",
              "name": "峨眉山市",
              "areacode": "511100"
            }
          ]
        },
        {
          "id": 251,
          "code": "511300",
          "name": "南充市",
          "citycode": "510000",
          "district": [
            {
              "id": 2348,
              "code": "511301",
              "name": "市辖区",
              "areacode": "511300"
            },
            {
              "id": 2349,
              "code": "511302",
              "name": "顺庆区",
              "areacode": "511300"
            },
            {
              "id": 2350,
              "code": "511303",
              "name": "高坪区",
              "areacode": "511300"
            },
            {
              "id": 2351,
              "code": "511304",
              "name": "嘉陵区",
              "areacode": "511300"
            },
            {
              "id": 2352,
              "code": "511321",
              "name": "南部县",
              "areacode": "511300"
            },
            {
              "id": 2353,
              "code": "511322",
              "name": "营山县",
              "areacode": "511300"
            },
            {
              "id": 2354,
              "code": "511323",
              "name": "蓬安县",
              "areacode": "511300"
            },
            {
              "id": 2355,
              "code": "511324",
              "name": "仪陇县",
              "areacode": "511300"
            },
            {
              "id": 2356,
              "code": "511325",
              "name": "西充县",
              "areacode": "511300"
            },
            {
              "id": 2357,
              "code": "511381",
              "name": "阆中市",
              "areacode": "511300"
            }
          ]
        },
        {
          "id": 252,
          "code": "511400",
          "name": "眉山市",
          "citycode": "510000",
          "district": [
            {
              "id": 2358,
              "code": "511401",
              "name": "市辖区",
              "areacode": "511400"
            },
            {
              "id": 2359,
              "code": "511402",
              "name": "东坡区",
              "areacode": "511400"
            },
            {
              "id": 2360,
              "code": "511421",
              "name": "仁寿县",
              "areacode": "511400"
            },
            {
              "id": 2361,
              "code": "511422",
              "name": "彭山县",
              "areacode": "511400"
            },
            {
              "id": 2362,
              "code": "511423",
              "name": "洪雅县",
              "areacode": "511400"
            },
            {
              "id": 2363,
              "code": "511424",
              "name": "丹棱县",
              "areacode": "511400"
            },
            {
              "id": 2364,
              "code": "511425",
              "name": "青神县",
              "areacode": "511400"
            }
          ]
        },
        {
          "id": 253,
          "code": "511500",
          "name": "宜宾市",
          "citycode": "510000",
          "district": [
            {
              "id": 2365,
              "code": "511501",
              "name": "市辖区",
              "areacode": "511500"
            },
            {
              "id": 2366,
              "code": "511502",
              "name": "翠屏区",
              "areacode": "511500"
            },
            {
              "id": 2367,
              "code": "511521",
              "name": "宜宾县",
              "areacode": "511500"
            },
            {
              "id": 2368,
              "code": "511522",
              "name": "南溪县",
              "areacode": "511500"
            },
            {
              "id": 2369,
              "code": "511523",
              "name": "江安县",
              "areacode": "511500"
            },
            {
              "id": 2370,
              "code": "511524",
              "name": "长宁县",
              "areacode": "511500"
            },
            {
              "id": 2371,
              "code": "511525",
              "name": "高　县",
              "areacode": "511500"
            },
            {
              "id": 2372,
              "code": "511526",
              "name": "珙　县",
              "areacode": "511500"
            },
            {
              "id": 2373,
              "code": "511527",
              "name": "筠连县",
              "areacode": "511500"
            },
            {
              "id": 2374,
              "code": "511528",
              "name": "兴文县",
              "areacode": "511500"
            },
            {
              "id": 2375,
              "code": "511529",
              "name": "屏山县",
              "areacode": "511500"
            }
          ]
        },
        {
          "id": 254,
          "code": "511600",
          "name": "广安市",
          "citycode": "510000",
          "district": [
            {
              "id": 2376,
              "code": "511601",
              "name": "市辖区",
              "areacode": "511600"
            },
            {
              "id": 2377,
              "code": "511602",
              "name": "广安区",
              "areacode": "511600"
            },
            {
              "id": 2378,
              "code": "511621",
              "name": "岳池县",
              "areacode": "511600"
            },
            {
              "id": 2379,
              "code": "511622",
              "name": "武胜县",
              "areacode": "511600"
            },
            {
              "id": 2380,
              "code": "511623",
              "name": "邻水县",
              "areacode": "511600"
            },
            {
              "id": 2381,
              "code": "511681",
              "name": "华莹市",
              "areacode": "511600"
            }
          ]
        },
        {
          "id": 255,
          "code": "511700",
          "name": "达州市",
          "citycode": "510000",
          "district": [
            {
              "id": 2382,
              "code": "511701",
              "name": "市辖区",
              "areacode": "511700"
            },
            {
              "id": 2383,
              "code": "511702",
              "name": "通川区",
              "areacode": "511700"
            },
            {
              "id": 2384,
              "code": "511721",
              "name": "达　县",
              "areacode": "511700"
            },
            {
              "id": 2385,
              "code": "511722",
              "name": "宣汉县",
              "areacode": "511700"
            },
            {
              "id": 2386,
              "code": "511723",
              "name": "开江县",
              "areacode": "511700"
            },
            {
              "id": 2387,
              "code": "511724",
              "name": "大竹县",
              "areacode": "511700"
            },
            {
              "id": 2388,
              "code": "511725",
              "name": "渠　县",
              "areacode": "511700"
            },
            {
              "id": 2389,
              "code": "511781",
              "name": "万源市",
              "areacode": "511700"
            }
          ]
        },
        {
          "id": 256,
          "code": "511800",
          "name": "雅安市",
          "citycode": "510000",
          "district": [
            {
              "id": 2390,
              "code": "511801",
              "name": "市辖区",
              "areacode": "511800"
            },
            {
              "id": 2391,
              "code": "511802",
              "name": "雨城区",
              "areacode": "511800"
            },
            {
              "id": 2392,
              "code": "511821",
              "name": "名山县",
              "areacode": "511800"
            },
            {
              "id": 2393,
              "code": "511822",
              "name": "荥经县",
              "areacode": "511800"
            },
            {
              "id": 2394,
              "code": "511823",
              "name": "汉源县",
              "areacode": "511800"
            },
            {
              "id": 2395,
              "code": "511824",
              "name": "石棉县",
              "areacode": "511800"
            },
            {
              "id": 2396,
              "code": "511825",
              "name": "天全县",
              "areacode": "511800"
            },
            {
              "id": 2397,
              "code": "511826",
              "name": "芦山县",
              "areacode": "511800"
            },
            {
              "id": 2398,
              "code": "511827",
              "name": "宝兴县",
              "areacode": "511800"
            }
          ]
        },
        {
          "id": 257,
          "code": "511900",
          "name": "巴中市",
          "citycode": "510000",
          "district": [
            {
              "id": 2399,
              "code": "511901",
              "name": "市辖区",
              "areacode": "511900"
            },
            {
              "id": 2400,
              "code": "511902",
              "name": "巴州区",
              "areacode": "511900"
            },
            {
              "id": 2401,
              "code": "511921",
              "name": "通江县",
              "areacode": "511900"
            },
            {
              "id": 2402,
              "code": "511922",
              "name": "南江县",
              "areacode": "511900"
            },
            {
              "id": 2403,
              "code": "511923",
              "name": "平昌县",
              "areacode": "511900"
            }
          ]
        },
        {
          "id": 258,
          "code": "512000",
          "name": "资阳市",
          "citycode": "510000",
          "district": [
            {
              "id": 2404,
              "code": "512001",
              "name": "市辖区",
              "areacode": "512000"
            },
            {
              "id": 2405,
              "code": "512002",
              "name": "雁江区",
              "areacode": "512000"
            },
            {
              "id": 2406,
              "code": "512021",
              "name": "安岳县",
              "areacode": "512000"
            },
            {
              "id": 2407,
              "code": "512022",
              "name": "乐至县",
              "areacode": "512000"
            },
            {
              "id": 2408,
              "code": "512081",
              "name": "简阳市",
              "areacode": "512000"
            }
          ]
        },
        {
          "id": 259,
          "code": "513200",
          "name": "阿坝藏族羌族自治州",
          "citycode": "510000",
          "district": [
            {
              "id": 2409,
              "code": "513221",
              "name": "汶川县",
              "areacode": "513200"
            },
            {
              "id": 2410,
              "code": "513222",
              "name": "理　县",
              "areacode": "513200"
            },
            {
              "id": 2411,
              "code": "513223",
              "name": "茂　县",
              "areacode": "513200"
            },
            {
              "id": 2412,
              "code": "513224",
              "name": "松潘县",
              "areacode": "513200"
            },
            {
              "id": 2413,
              "code": "513225",
              "name": "九寨沟县",
              "areacode": "513200"
            },
            {
              "id": 2414,
              "code": "513226",
              "name": "金川县",
              "areacode": "513200"
            },
            {
              "id": 2415,
              "code": "513227",
              "name": "小金县",
              "areacode": "513200"
            },
            {
              "id": 2416,
              "code": "513228",
              "name": "黑水县",
              "areacode": "513200"
            },
            {
              "id": 2417,
              "code": "513229",
              "name": "马尔康县",
              "areacode": "513200"
            },
            {
              "id": 2418,
              "code": "513230",
              "name": "壤塘县",
              "areacode": "513200"
            },
            {
              "id": 2419,
              "code": "513231",
              "name": "阿坝县",
              "areacode": "513200"
            },
            {
              "id": 2420,
              "code": "513232",
              "name": "若尔盖县",
              "areacode": "513200"
            },
            {
              "id": 2421,
              "code": "513233",
              "name": "红原县",
              "areacode": "513200"
            }
          ]
        },
        {
          "id": 260,
          "code": "513300",
          "name": "甘孜藏族自治州",
          "citycode": "510000",
          "district": [
            {
              "id": 2422,
              "code": "513321",
              "name": "康定县",
              "areacode": "513300"
            },
            {
              "id": 2423,
              "code": "513322",
              "name": "泸定县",
              "areacode": "513300"
            },
            {
              "id": 2424,
              "code": "513323",
              "name": "丹巴县",
              "areacode": "513300"
            },
            {
              "id": 2425,
              "code": "513324",
              "name": "九龙县",
              "areacode": "513300"
            },
            {
              "id": 2426,
              "code": "513325",
              "name": "雅江县",
              "areacode": "513300"
            },
            {
              "id": 2427,
              "code": "513326",
              "name": "道孚县",
              "areacode": "513300"
            },
            {
              "id": 2428,
              "code": "513327",
              "name": "炉霍县",
              "areacode": "513300"
            },
            {
              "id": 2429,
              "code": "513328",
              "name": "甘孜县",
              "areacode": "513300"
            },
            {
              "id": 2430,
              "code": "513329",
              "name": "新龙县",
              "areacode": "513300"
            },
            {
              "id": 2431,
              "code": "513330",
              "name": "德格县",
              "areacode": "513300"
            },
            {
              "id": 2432,
              "code": "513331",
              "name": "白玉县",
              "areacode": "513300"
            },
            {
              "id": 2433,
              "code": "513332",
              "name": "石渠县",
              "areacode": "513300"
            },
            {
              "id": 2434,
              "code": "513333",
              "name": "色达县",
              "areacode": "513300"
            },
            {
              "id": 2435,
              "code": "513334",
              "name": "理塘县",
              "areacode": "513300"
            },
            {
              "id": 2436,
              "code": "513335",
              "name": "巴塘县",
              "areacode": "513300"
            },
            {
              "id": 2437,
              "code": "513336",
              "name": "乡城县",
              "areacode": "513300"
            },
            {
              "id": 2438,
              "code": "513337",
              "name": "稻城县",
              "areacode": "513300"
            },
            {
              "id": 2439,
              "code": "513338",
              "name": "得荣县",
              "areacode": "513300"
            }
          ]
        },
        {
          "id": 261,
          "code": "513400",
          "name": "凉山彝族自治州",
          "citycode": "510000",
          "district": [
            {
              "id": 2440,
              "code": "513401",
              "name": "西昌市",
              "areacode": "513400"
            },
            {
              "id": 2441,
              "code": "513422",
              "name": "木里藏族自治县",
              "areacode": "513400"
            },
            {
              "id": 2442,
              "code": "513423",
              "name": "盐源县",
              "areacode": "513400"
            },
            {
              "id": 2443,
              "code": "513424",
              "name": "德昌县",
              "areacode": "513400"
            },
            {
              "id": 2444,
              "code": "513425",
              "name": "会理县",
              "areacode": "513400"
            },
            {
              "id": 2445,
              "code": "513426",
              "name": "会东县",
              "areacode": "513400"
            },
            {
              "id": 2446,
              "code": "513427",
              "name": "宁南县",
              "areacode": "513400"
            },
            {
              "id": 2447,
              "code": "513428",
              "name": "普格县",
              "areacode": "513400"
            },
            {
              "id": 2448,
              "code": "513429",
              "name": "布拖县",
              "areacode": "513400"
            },
            {
              "id": 2449,
              "code": "513430",
              "name": "金阳县",
              "areacode": "513400"
            },
            {
              "id": 2450,
              "code": "513431",
              "name": "昭觉县",
              "areacode": "513400"
            },
            {
              "id": 2451,
              "code": "513432",
              "name": "喜德县",
              "areacode": "513400"
            },
            {
              "id": 2452,
              "code": "513433",
              "name": "冕宁县",
              "areacode": "513400"
            },
            {
              "id": 2453,
              "code": "513434",
              "name": "越西县",
              "areacode": "513400"
            },
            {
              "id": 2454,
              "code": "513435",
              "name": "甘洛县",
              "areacode": "513400"
            },
            {
              "id": 2455,
              "code": "513436",
              "name": "美姑县",
              "areacode": "513400"
            },
            {
              "id": 2456,
              "code": "513437",
              "name": "雷波县",
              "areacode": "513400"
            }
          ]
        }
      ]
    },
    {
      "id": 24,
      "code": "520000",
      "name": "贵州省",
      "city": [
        {
          "id": 262,
          "code": "520100",
          "name": "贵阳市",
          "citycode": "520000",
          "district": [
            {
              "id": 2457,
              "code": "520101",
              "name": "市辖区",
              "areacode": "520100"
            },
            {
              "id": 2458,
              "code": "520102",
              "name": "南明区",
              "areacode": "520100"
            },
            {
              "id": 2459,
              "code": "520103",
              "name": "云岩区",
              "areacode": "520100"
            },
            {
              "id": 2460,
              "code": "520111",
              "name": "花溪区",
              "areacode": "520100"
            },
            {
              "id": 2461,
              "code": "520112",
              "name": "乌当区",
              "areacode": "520100"
            },
            {
              "id": 2462,
              "code": "520113",
              "name": "白云区",
              "areacode": "520100"
            },
            {
              "id": 2463,
              "code": "520114",
              "name": "小河区",
              "areacode": "520100"
            },
            {
              "id": 2464,
              "code": "520121",
              "name": "开阳县",
              "areacode": "520100"
            },
            {
              "id": 2465,
              "code": "520122",
              "name": "息烽县",
              "areacode": "520100"
            },
            {
              "id": 2466,
              "code": "520123",
              "name": "修文县",
              "areacode": "520100"
            },
            {
              "id": 2467,
              "code": "520181",
              "name": "清镇市",
              "areacode": "520100"
            }
          ]
        },
        {
          "id": 263,
          "code": "520200",
          "name": "六盘水市",
          "citycode": "520000",
          "district": [
            {
              "id": 2468,
              "code": "520201",
              "name": "钟山区",
              "areacode": "520200"
            },
            {
              "id": 2469,
              "code": "520203",
              "name": "六枝特区",
              "areacode": "520200"
            },
            {
              "id": 2470,
              "code": "520221",
              "name": "水城县",
              "areacode": "520200"
            },
            {
              "id": 2471,
              "code": "520222",
              "name": "盘　县",
              "areacode": "520200"
            }
          ]
        },
        {
          "id": 264,
          "code": "520300",
          "name": "遵义市",
          "citycode": "520000",
          "district": [
            {
              "id": 2472,
              "code": "520301",
              "name": "市辖区",
              "areacode": "520300"
            },
            {
              "id": 2473,
              "code": "520302",
              "name": "红花岗区",
              "areacode": "520300"
            },
            {
              "id": 2474,
              "code": "520303",
              "name": "汇川区",
              "areacode": "520300"
            },
            {
              "id": 2475,
              "code": "520321",
              "name": "遵义县",
              "areacode": "520300"
            },
            {
              "id": 2476,
              "code": "520322",
              "name": "桐梓县",
              "areacode": "520300"
            },
            {
              "id": 2477,
              "code": "520323",
              "name": "绥阳县",
              "areacode": "520300"
            },
            {
              "id": 2478,
              "code": "520324",
              "name": "正安县",
              "areacode": "520300"
            },
            {
              "id": 2479,
              "code": "520325",
              "name": "道真仡佬族苗族自治县",
              "areacode": "520300"
            },
            {
              "id": 2480,
              "code": "520326",
              "name": "务川仡佬族苗族自治县",
              "areacode": "520300"
            },
            {
              "id": 2481,
              "code": "520327",
              "name": "凤冈县",
              "areacode": "520300"
            },
            {
              "id": 2482,
              "code": "520328",
              "name": "湄潭县",
              "areacode": "520300"
            },
            {
              "id": 2483,
              "code": "520329",
              "name": "余庆县",
              "areacode": "520300"
            },
            {
              "id": 2484,
              "code": "520330",
              "name": "习水县",
              "areacode": "520300"
            },
            {
              "id": 2485,
              "code": "520381",
              "name": "赤水市",
              "areacode": "520300"
            },
            {
              "id": 2486,
              "code": "520382",
              "name": "仁怀市",
              "areacode": "520300"
            }
          ]
        },
        {
          "id": 265,
          "code": "520400",
          "name": "安顺市",
          "citycode": "520000",
          "district": [
            {
              "id": 2487,
              "code": "520401",
              "name": "市辖区",
              "areacode": "520400"
            },
            {
              "id": 2488,
              "code": "520402",
              "name": "西秀区",
              "areacode": "520400"
            },
            {
              "id": 2489,
              "code": "520421",
              "name": "平坝县",
              "areacode": "520400"
            },
            {
              "id": 2490,
              "code": "520422",
              "name": "普定县",
              "areacode": "520400"
            },
            {
              "id": 2491,
              "code": "520423",
              "name": "镇宁布依族苗族自治县",
              "areacode": "520400"
            },
            {
              "id": 2492,
              "code": "520424",
              "name": "关岭布依族苗族自治县",
              "areacode": "520400"
            },
            {
              "id": 2493,
              "code": "520425",
              "name": "紫云苗族布依族自治县",
              "areacode": "520400"
            }
          ]
        },
        {
          "id": 266,
          "code": "522200",
          "name": "铜仁地区",
          "citycode": "520000",
          "district": [
            {
              "id": 2494,
              "code": "522201",
              "name": "铜仁市",
              "areacode": "522200"
            },
            {
              "id": 2495,
              "code": "522222",
              "name": "江口县",
              "areacode": "522200"
            },
            {
              "id": 2496,
              "code": "522223",
              "name": "玉屏侗族自治县",
              "areacode": "522200"
            },
            {
              "id": 2497,
              "code": "522224",
              "name": "石阡县",
              "areacode": "522200"
            },
            {
              "id": 2498,
              "code": "522225",
              "name": "思南县",
              "areacode": "522200"
            },
            {
              "id": 2499,
              "code": "522226",
              "name": "印江土家族苗族自治县",
              "areacode": "522200"
            },
            {
              "id": 2500,
              "code": "522227",
              "name": "德江县",
              "areacode": "522200"
            },
            {
              "id": 2501,
              "code": "522228",
              "name": "沿河土家族自治县",
              "areacode": "522200"
            },
            {
              "id": 2502,
              "code": "522229",
              "name": "松桃苗族自治县",
              "areacode": "522200"
            },
            {
              "id": 2503,
              "code": "522230",
              "name": "万山特区",
              "areacode": "522200"
            }
          ]
        },
        {
          "id": 267,
          "code": "522300",
          "name": "黔西南布依族苗族自治州",
          "citycode": "520000",
          "district": [
            {
              "id": 2504,
              "code": "522301",
              "name": "兴义市",
              "areacode": "522300"
            },
            {
              "id": 2505,
              "code": "522322",
              "name": "兴仁县",
              "areacode": "522300"
            },
            {
              "id": 2506,
              "code": "522323",
              "name": "普安县",
              "areacode": "522300"
            },
            {
              "id": 2507,
              "code": "522324",
              "name": "晴隆县",
              "areacode": "522300"
            },
            {
              "id": 2508,
              "code": "522325",
              "name": "贞丰县",
              "areacode": "522300"
            },
            {
              "id": 2509,
              "code": "522326",
              "name": "望谟县",
              "areacode": "522300"
            },
            {
              "id": 2510,
              "code": "522327",
              "name": "册亨县",
              "areacode": "522300"
            },
            {
              "id": 2511,
              "code": "522328",
              "name": "安龙县",
              "areacode": "522300"
            }
          ]
        },
        {
          "id": 268,
          "code": "522400",
          "name": "毕节地区",
          "citycode": "520000",
          "district": [
            {
              "id": 2512,
              "code": "522401",
              "name": "毕节市",
              "areacode": "522400"
            },
            {
              "id": 2513,
              "code": "522422",
              "name": "大方县",
              "areacode": "522400"
            },
            {
              "id": 2514,
              "code": "522423",
              "name": "黔西县",
              "areacode": "522400"
            },
            {
              "id": 2515,
              "code": "522424",
              "name": "金沙县",
              "areacode": "522400"
            },
            {
              "id": 2516,
              "code": "522425",
              "name": "织金县",
              "areacode": "522400"
            },
            {
              "id": 2517,
              "code": "522426",
              "name": "纳雍县",
              "areacode": "522400"
            },
            {
              "id": 2518,
              "code": "522427",
              "name": "威宁彝族回族苗族自治县",
              "areacode": "522400"
            },
            {
              "id": 2519,
              "code": "522428",
              "name": "赫章县",
              "areacode": "522400"
            }
          ]
        },
        {
          "id": 269,
          "code": "522600",
          "name": "黔东南苗族侗族自治州",
          "citycode": "520000",
          "district": [
            {
              "id": 2520,
              "code": "522601",
              "name": "凯里市",
              "areacode": "522600"
            },
            {
              "id": 2521,
              "code": "522622",
              "name": "黄平县",
              "areacode": "522600"
            },
            {
              "id": 2522,
              "code": "522623",
              "name": "施秉县",
              "areacode": "522600"
            },
            {
              "id": 2523,
              "code": "522624",
              "name": "三穗县",
              "areacode": "522600"
            },
            {
              "id": 2524,
              "code": "522625",
              "name": "镇远县",
              "areacode": "522600"
            },
            {
              "id": 2525,
              "code": "522626",
              "name": "岑巩县",
              "areacode": "522600"
            },
            {
              "id": 2526,
              "code": "522627",
              "name": "天柱县",
              "areacode": "522600"
            },
            {
              "id": 2527,
              "code": "522628",
              "name": "锦屏县",
              "areacode": "522600"
            },
            {
              "id": 2528,
              "code": "522629",
              "name": "剑河县",
              "areacode": "522600"
            },
            {
              "id": 2529,
              "code": "522630",
              "name": "台江县",
              "areacode": "522600"
            },
            {
              "id": 2530,
              "code": "522631",
              "name": "黎平县",
              "areacode": "522600"
            },
            {
              "id": 2531,
              "code": "522632",
              "name": "榕江县",
              "areacode": "522600"
            },
            {
              "id": 2532,
              "code": "522633",
              "name": "从江县",
              "areacode": "522600"
            },
            {
              "id": 2533,
              "code": "522634",
              "name": "雷山县",
              "areacode": "522600"
            },
            {
              "id": 2534,
              "code": "522635",
              "name": "麻江县",
              "areacode": "522600"
            },
            {
              "id": 2535,
              "code": "522636",
              "name": "丹寨县",
              "areacode": "522600"
            }
          ]
        },
        {
          "id": 270,
          "code": "522700",
          "name": "黔南布依族苗族自治州",
          "citycode": "520000",
          "district": [
            {
              "id": 2536,
              "code": "522701",
              "name": "都匀市",
              "areacode": "522700"
            },
            {
              "id": 2537,
              "code": "522702",
              "name": "福泉市",
              "areacode": "522700"
            },
            {
              "id": 2538,
              "code": "522722",
              "name": "荔波县",
              "areacode": "522700"
            },
            {
              "id": 2539,
              "code": "522723",
              "name": "贵定县",
              "areacode": "522700"
            },
            {
              "id": 2540,
              "code": "522725",
              "name": "瓮安县",
              "areacode": "522700"
            },
            {
              "id": 2541,
              "code": "522726",
              "name": "独山县",
              "areacode": "522700"
            },
            {
              "id": 2542,
              "code": "522727",
              "name": "平塘县",
              "areacode": "522700"
            },
            {
              "id": 2543,
              "code": "522728",
              "name": "罗甸县",
              "areacode": "522700"
            },
            {
              "id": 2544,
              "code": "522729",
              "name": "长顺县",
              "areacode": "522700"
            },
            {
              "id": 2545,
              "code": "522730",
              "name": "龙里县",
              "areacode": "522700"
            },
            {
              "id": 2546,
              "code": "522731",
              "name": "惠水县",
              "areacode": "522700"
            },
            {
              "id": 2547,
              "code": "522732",
              "name": "三都水族自治县",
              "areacode": "522700"
            }
          ]
        }
      ]
    },
    {
      "id": 25,
      "code": "530000",
      "name": "云南省",
      "city": [
        {
          "id": 271,
          "code": "530100",
          "name": "昆明市",
          "citycode": "530000",
          "district": [
            {
              "id": 2548,
              "code": "530101",
              "name": "市辖区",
              "areacode": "530100"
            },
            {
              "id": 2549,
              "code": "530102",
              "name": "五华区",
              "areacode": "530100"
            },
            {
              "id": 2550,
              "code": "530103",
              "name": "盘龙区",
              "areacode": "530100"
            },
            {
              "id": 2551,
              "code": "530111",
              "name": "官渡区",
              "areacode": "530100"
            },
            {
              "id": 2552,
              "code": "530112",
              "name": "西山区",
              "areacode": "530100"
            },
            {
              "id": 2553,
              "code": "530113",
              "name": "东川区",
              "areacode": "530100"
            },
            {
              "id": 2554,
              "code": "530121",
              "name": "呈贡县",
              "areacode": "530100"
            },
            {
              "id": 2555,
              "code": "530122",
              "name": "晋宁县",
              "areacode": "530100"
            },
            {
              "id": 2556,
              "code": "530124",
              "name": "富民县",
              "areacode": "530100"
            },
            {
              "id": 2557,
              "code": "530125",
              "name": "宜良县",
              "areacode": "530100"
            },
            {
              "id": 2558,
              "code": "530126",
              "name": "石林彝族自治县",
              "areacode": "530100"
            },
            {
              "id": 2559,
              "code": "530127",
              "name": "嵩明县",
              "areacode": "530100"
            },
            {
              "id": 2560,
              "code": "530128",
              "name": "禄劝彝族苗族自治县",
              "areacode": "530100"
            },
            {
              "id": 2561,
              "code": "530129",
              "name": "寻甸回族彝族自治县",
              "areacode": "530100"
            },
            {
              "id": 2562,
              "code": "530181",
              "name": "安宁市",
              "areacode": "530100"
            }
          ]
        },
        {
          "id": 272,
          "code": "530300",
          "name": "曲靖市",
          "citycode": "530000",
          "district": [
            {
              "id": 2563,
              "code": "530301",
              "name": "市辖区",
              "areacode": "530300"
            },
            {
              "id": 2564,
              "code": "530302",
              "name": "麒麟区",
              "areacode": "530300"
            },
            {
              "id": 2565,
              "code": "530321",
              "name": "马龙县",
              "areacode": "530300"
            },
            {
              "id": 2566,
              "code": "530322",
              "name": "陆良县",
              "areacode": "530300"
            },
            {
              "id": 2567,
              "code": "530323",
              "name": "师宗县",
              "areacode": "530300"
            },
            {
              "id": 2568,
              "code": "530324",
              "name": "罗平县",
              "areacode": "530300"
            },
            {
              "id": 2569,
              "code": "530325",
              "name": "富源县",
              "areacode": "530300"
            },
            {
              "id": 2570,
              "code": "530326",
              "name": "会泽县",
              "areacode": "530300"
            },
            {
              "id": 2571,
              "code": "530328",
              "name": "沾益县",
              "areacode": "530300"
            },
            {
              "id": 2572,
              "code": "530381",
              "name": "宣威市",
              "areacode": "530300"
            }
          ]
        },
        {
          "id": 273,
          "code": "530400",
          "name": "玉溪市",
          "citycode": "530000",
          "district": [
            {
              "id": 2573,
              "code": "530401",
              "name": "市辖区",
              "areacode": "530400"
            },
            {
              "id": 2574,
              "code": "530402",
              "name": "红塔区",
              "areacode": "530400"
            },
            {
              "id": 2575,
              "code": "530421",
              "name": "江川县",
              "areacode": "530400"
            },
            {
              "id": 2576,
              "code": "530422",
              "name": "澄江县",
              "areacode": "530400"
            },
            {
              "id": 2577,
              "code": "530423",
              "name": "通海县",
              "areacode": "530400"
            },
            {
              "id": 2578,
              "code": "530424",
              "name": "华宁县",
              "areacode": "530400"
            },
            {
              "id": 2579,
              "code": "530425",
              "name": "易门县",
              "areacode": "530400"
            },
            {
              "id": 2580,
              "code": "530426",
              "name": "峨山彝族自治县",
              "areacode": "530400"
            },
            {
              "id": 2581,
              "code": "530427",
              "name": "新平彝族傣族自治县",
              "areacode": "530400"
            },
            {
              "id": 2582,
              "code": "530428",
              "name": "元江哈尼族彝族傣族自治县",
              "areacode": "530400"
            }
          ]
        },
        {
          "id": 274,
          "code": "530500",
          "name": "保山市",
          "citycode": "530000",
          "district": [
            {
              "id": 2583,
              "code": "530501",
              "name": "市辖区",
              "areacode": "530500"
            },
            {
              "id": 2584,
              "code": "530502",
              "name": "隆阳区",
              "areacode": "530500"
            },
            {
              "id": 2585,
              "code": "530521",
              "name": "施甸县",
              "areacode": "530500"
            },
            {
              "id": 2586,
              "code": "530522",
              "name": "腾冲县",
              "areacode": "530500"
            },
            {
              "id": 2587,
              "code": "530523",
              "name": "龙陵县",
              "areacode": "530500"
            },
            {
              "id": 2588,
              "code": "530524",
              "name": "昌宁县",
              "areacode": "530500"
            }
          ]
        },
        {
          "id": 275,
          "code": "530600",
          "name": "昭通市",
          "citycode": "530000",
          "district": [
            {
              "id": 2589,
              "code": "530601",
              "name": "市辖区",
              "areacode": "530600"
            },
            {
              "id": 2590,
              "code": "530602",
              "name": "昭阳区",
              "areacode": "530600"
            },
            {
              "id": 2591,
              "code": "530621",
              "name": "鲁甸县",
              "areacode": "530600"
            },
            {
              "id": 2592,
              "code": "530622",
              "name": "巧家县",
              "areacode": "530600"
            },
            {
              "id": 2593,
              "code": "530623",
              "name": "盐津县",
              "areacode": "530600"
            },
            {
              "id": 2594,
              "code": "530624",
              "name": "大关县",
              "areacode": "530600"
            },
            {
              "id": 2595,
              "code": "530625",
              "name": "永善县",
              "areacode": "530600"
            },
            {
              "id": 2596,
              "code": "530626",
              "name": "绥江县",
              "areacode": "530600"
            },
            {
              "id": 2597,
              "code": "530627",
              "name": "镇雄县",
              "areacode": "530600"
            },
            {
              "id": 2598,
              "code": "530628",
              "name": "彝良县",
              "areacode": "530600"
            },
            {
              "id": 2599,
              "code": "530629",
              "name": "威信县",
              "areacode": "530600"
            },
            {
              "id": 2600,
              "code": "530630",
              "name": "水富县",
              "areacode": "530600"
            }
          ]
        },
        {
          "id": 276,
          "code": "530700",
          "name": "丽江市",
          "citycode": "530000",
          "district": [
            {
              "id": 2601,
              "code": "530701",
              "name": "市辖区",
              "areacode": "530700"
            },
            {
              "id": 2602,
              "code": "530702",
              "name": "古城区",
              "areacode": "530700"
            },
            {
              "id": 2603,
              "code": "530721",
              "name": "玉龙纳西族自治县",
              "areacode": "530700"
            },
            {
              "id": 2604,
              "code": "530722",
              "name": "永胜县",
              "areacode": "530700"
            },
            {
              "id": 2605,
              "code": "530723",
              "name": "华坪县",
              "areacode": "530700"
            },
            {
              "id": 2606,
              "code": "530724",
              "name": "宁蒗彝族自治县",
              "areacode": "530700"
            }
          ]
        },
        {
          "id": 277,
          "code": "530800",
          "name": "思茅市",
          "citycode": "530000",
          "district": [
            {
              "id": 2607,
              "code": "530801",
              "name": "市辖区",
              "areacode": "530800"
            },
            {
              "id": 2608,
              "code": "530802",
              "name": "翠云区",
              "areacode": "530800"
            },
            {
              "id": 2609,
              "code": "530821",
              "name": "普洱哈尼族彝族自治县",
              "areacode": "530800"
            },
            {
              "id": 2610,
              "code": "530822",
              "name": "墨江哈尼族自治县",
              "areacode": "530800"
            },
            {
              "id": 2611,
              "code": "530823",
              "name": "景东彝族自治县",
              "areacode": "530800"
            },
            {
              "id": 2612,
              "code": "530824",
              "name": "景谷傣族彝族自治县",
              "areacode": "530800"
            },
            {
              "id": 2613,
              "code": "530825",
              "name": "镇沅彝族哈尼族拉祜族自治县",
              "areacode": "530800"
            },
            {
              "id": 2614,
              "code": "530826",
              "name": "江城哈尼族彝族自治县",
              "areacode": "530800"
            },
            {
              "id": 2615,
              "code": "530827",
              "name": "孟连傣族拉祜族佤族自治县",
              "areacode": "530800"
            },
            {
              "id": 2616,
              "code": "530828",
              "name": "澜沧拉祜族自治县",
              "areacode": "530800"
            },
            {
              "id": 2617,
              "code": "530829",
              "name": "西盟佤族自治县",
              "areacode": "530800"
            }
          ]
        },
        {
          "id": 278,
          "code": "530900",
          "name": "临沧市",
          "citycode": "530000",
          "district": [
            {
              "id": 2618,
              "code": "530901",
              "name": "市辖区",
              "areacode": "530900"
            },
            {
              "id": 2619,
              "code": "530902",
              "name": "临翔区",
              "areacode": "530900"
            },
            {
              "id": 2620,
              "code": "530921",
              "name": "凤庆县",
              "areacode": "530900"
            },
            {
              "id": 2621,
              "code": "530922",
              "name": "云　县",
              "areacode": "530900"
            },
            {
              "id": 2622,
              "code": "530923",
              "name": "永德县",
              "areacode": "530900"
            },
            {
              "id": 2623,
              "code": "530924",
              "name": "镇康县",
              "areacode": "530900"
            },
            {
              "id": 2624,
              "code": "530925",
              "name": "双江拉祜族佤族布朗族傣族自治县",
              "areacode": "530900"
            },
            {
              "id": 2625,
              "code": "530926",
              "name": "耿马傣族佤族自治县",
              "areacode": "530900"
            },
            {
              "id": 2626,
              "code": "530927",
              "name": "沧源佤族自治县",
              "areacode": "530900"
            }
          ]
        },
        {
          "id": 279,
          "code": "532300",
          "name": "楚雄彝族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2627,
              "code": "532301",
              "name": "楚雄市",
              "areacode": "532300"
            },
            {
              "id": 2628,
              "code": "532322",
              "name": "双柏县",
              "areacode": "532300"
            },
            {
              "id": 2629,
              "code": "532323",
              "name": "牟定县",
              "areacode": "532300"
            },
            {
              "id": 2630,
              "code": "532324",
              "name": "南华县",
              "areacode": "532300"
            },
            {
              "id": 2631,
              "code": "532325",
              "name": "姚安县",
              "areacode": "532300"
            },
            {
              "id": 2632,
              "code": "532326",
              "name": "大姚县",
              "areacode": "532300"
            },
            {
              "id": 2633,
              "code": "532327",
              "name": "永仁县",
              "areacode": "532300"
            },
            {
              "id": 2634,
              "code": "532328",
              "name": "元谋县",
              "areacode": "532300"
            },
            {
              "id": 2635,
              "code": "532329",
              "name": "武定县",
              "areacode": "532300"
            },
            {
              "id": 2636,
              "code": "532331",
              "name": "禄丰县",
              "areacode": "532300"
            }
          ]
        },
        {
          "id": 280,
          "code": "532500",
          "name": "红河哈尼族彝族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2637,
              "code": "532501",
              "name": "个旧市",
              "areacode": "532500"
            },
            {
              "id": 2638,
              "code": "532502",
              "name": "开远市",
              "areacode": "532500"
            },
            {
              "id": 2639,
              "code": "532522",
              "name": "蒙自县",
              "areacode": "532500"
            },
            {
              "id": 2640,
              "code": "532523",
              "name": "屏边苗族自治县",
              "areacode": "532500"
            },
            {
              "id": 2641,
              "code": "532524",
              "name": "建水县",
              "areacode": "532500"
            },
            {
              "id": 2642,
              "code": "532525",
              "name": "石屏县",
              "areacode": "532500"
            },
            {
              "id": 2643,
              "code": "532526",
              "name": "弥勒县",
              "areacode": "532500"
            },
            {
              "id": 2644,
              "code": "532527",
              "name": "泸西县",
              "areacode": "532500"
            },
            {
              "id": 2645,
              "code": "532528",
              "name": "元阳县",
              "areacode": "532500"
            },
            {
              "id": 2646,
              "code": "532529",
              "name": "红河县",
              "areacode": "532500"
            },
            {
              "id": 2647,
              "code": "532530",
              "name": "金平苗族瑶族傣族自治县",
              "areacode": "532500"
            },
            {
              "id": 2648,
              "code": "532531",
              "name": "绿春县",
              "areacode": "532500"
            },
            {
              "id": 2649,
              "code": "532532",
              "name": "河口瑶族自治县",
              "areacode": "532500"
            }
          ]
        },
        {
          "id": 281,
          "code": "532600",
          "name": "文山壮族苗族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2650,
              "code": "532621",
              "name": "文山县",
              "areacode": "532600"
            },
            {
              "id": 2651,
              "code": "532622",
              "name": "砚山县",
              "areacode": "532600"
            },
            {
              "id": 2652,
              "code": "532623",
              "name": "西畴县",
              "areacode": "532600"
            },
            {
              "id": 2653,
              "code": "532624",
              "name": "麻栗坡县",
              "areacode": "532600"
            },
            {
              "id": 2654,
              "code": "532625",
              "name": "马关县",
              "areacode": "532600"
            },
            {
              "id": 2655,
              "code": "532626",
              "name": "丘北县",
              "areacode": "532600"
            },
            {
              "id": 2656,
              "code": "532627",
              "name": "广南县",
              "areacode": "532600"
            },
            {
              "id": 2657,
              "code": "532628",
              "name": "富宁县",
              "areacode": "532600"
            }
          ]
        },
        {
          "id": 282,
          "code": "532800",
          "name": "西双版纳傣族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2658,
              "code": "532801",
              "name": "景洪市",
              "areacode": "532800"
            },
            {
              "id": 2659,
              "code": "532822",
              "name": "勐海县",
              "areacode": "532800"
            },
            {
              "id": 2660,
              "code": "532823",
              "name": "勐腊县",
              "areacode": "532800"
            }
          ]
        },
        {
          "id": 283,
          "code": "532900",
          "name": "大理白族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2661,
              "code": "532901",
              "name": "大理市",
              "areacode": "532900"
            },
            {
              "id": 2662,
              "code": "532922",
              "name": "漾濞彝族自治县",
              "areacode": "532900"
            },
            {
              "id": 2663,
              "code": "532923",
              "name": "祥云县",
              "areacode": "532900"
            },
            {
              "id": 2664,
              "code": "532924",
              "name": "宾川县",
              "areacode": "532900"
            },
            {
              "id": 2665,
              "code": "532925",
              "name": "弥渡县",
              "areacode": "532900"
            },
            {
              "id": 2666,
              "code": "532926",
              "name": "南涧彝族自治县",
              "areacode": "532900"
            },
            {
              "id": 2667,
              "code": "532927",
              "name": "巍山彝族回族自治县",
              "areacode": "532900"
            },
            {
              "id": 2668,
              "code": "532928",
              "name": "永平县",
              "areacode": "532900"
            },
            {
              "id": 2669,
              "code": "532929",
              "name": "云龙县",
              "areacode": "532900"
            },
            {
              "id": 2670,
              "code": "532930",
              "name": "洱源县",
              "areacode": "532900"
            },
            {
              "id": 2671,
              "code": "532931",
              "name": "剑川县",
              "areacode": "532900"
            },
            {
              "id": 2672,
              "code": "532932",
              "name": "鹤庆县",
              "areacode": "532900"
            }
          ]
        },
        {
          "id": 284,
          "code": "533100",
          "name": "德宏傣族景颇族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2673,
              "code": "533102",
              "name": "瑞丽市",
              "areacode": "533100"
            },
            {
              "id": 2674,
              "code": "533103",
              "name": "潞西市",
              "areacode": "533100"
            },
            {
              "id": 2675,
              "code": "533122",
              "name": "梁河县",
              "areacode": "533100"
            },
            {
              "id": 2676,
              "code": "533123",
              "name": "盈江县",
              "areacode": "533100"
            },
            {
              "id": 2677,
              "code": "533124",
              "name": "陇川县",
              "areacode": "533100"
            }
          ]
        },
        {
          "id": 285,
          "code": "533300",
          "name": "怒江傈僳族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2678,
              "code": "533321",
              "name": "泸水县",
              "areacode": "533300"
            },
            {
              "id": 2679,
              "code": "533323",
              "name": "福贡县",
              "areacode": "533300"
            },
            {
              "id": 2680,
              "code": "533324",
              "name": "贡山独龙族怒族自治县",
              "areacode": "533300"
            },
            {
              "id": 2681,
              "code": "533325",
              "name": "兰坪白族普米族自治县",
              "areacode": "533300"
            }
          ]
        },
        {
          "id": 286,
          "code": "533400",
          "name": "迪庆藏族自治州",
          "citycode": "530000",
          "district": [
            {
              "id": 2682,
              "code": "533421",
              "name": "香格里拉县",
              "areacode": "533400"
            },
            {
              "id": 2683,
              "code": "533422",
              "name": "德钦县",
              "areacode": "533400"
            },
            {
              "id": 2684,
              "code": "533423",
              "name": "维西傈僳族自治县",
              "areacode": "533400"
            }
          ]
        }
      ]
    },
    {
      "id": 26,
      "code": "540000",
      "name": "西藏自治区",
      "city": [
        {
          "id": 287,
          "code": "540100",
          "name": "拉萨市",
          "citycode": "540000",
          "district": [
            {
              "id": 2685,
              "code": "540101",
              "name": "市辖区",
              "areacode": "540100"
            },
            {
              "id": 2686,
              "code": "540102",
              "name": "城关区",
              "areacode": "540100"
            },
            {
              "id": 2687,
              "code": "540121",
              "name": "林周县",
              "areacode": "540100"
            },
            {
              "id": 2688,
              "code": "540122",
              "name": "当雄县",
              "areacode": "540100"
            },
            {
              "id": 2689,
              "code": "540123",
              "name": "尼木县",
              "areacode": "540100"
            },
            {
              "id": 2690,
              "code": "540124",
              "name": "曲水县",
              "areacode": "540100"
            },
            {
              "id": 2691,
              "code": "540125",
              "name": "堆龙德庆县",
              "areacode": "540100"
            },
            {
              "id": 2692,
              "code": "540126",
              "name": "达孜县",
              "areacode": "540100"
            },
            {
              "id": 2693,
              "code": "540127",
              "name": "墨竹工卡县",
              "areacode": "540100"
            }
          ]
        },
        {
          "id": 288,
          "code": "542100",
          "name": "昌都地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2694,
              "code": "542121",
              "name": "昌都县",
              "areacode": "542100"
            },
            {
              "id": 2695,
              "code": "542122",
              "name": "江达县",
              "areacode": "542100"
            },
            {
              "id": 2696,
              "code": "542123",
              "name": "贡觉县",
              "areacode": "542100"
            },
            {
              "id": 2697,
              "code": "542124",
              "name": "类乌齐县",
              "areacode": "542100"
            },
            {
              "id": 2698,
              "code": "542125",
              "name": "丁青县",
              "areacode": "542100"
            },
            {
              "id": 2699,
              "code": "542126",
              "name": "察雅县",
              "areacode": "542100"
            },
            {
              "id": 2700,
              "code": "542127",
              "name": "八宿县",
              "areacode": "542100"
            },
            {
              "id": 2701,
              "code": "542128",
              "name": "左贡县",
              "areacode": "542100"
            },
            {
              "id": 2702,
              "code": "542129",
              "name": "芒康县",
              "areacode": "542100"
            },
            {
              "id": 2703,
              "code": "542132",
              "name": "洛隆县",
              "areacode": "542100"
            },
            {
              "id": 2704,
              "code": "542133",
              "name": "边坝县",
              "areacode": "542100"
            }
          ]
        },
        {
          "id": 289,
          "code": "542200",
          "name": "山南地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2705,
              "code": "542221",
              "name": "乃东县",
              "areacode": "542200"
            },
            {
              "id": 2706,
              "code": "542222",
              "name": "扎囊县",
              "areacode": "542200"
            },
            {
              "id": 2707,
              "code": "542223",
              "name": "贡嘎县",
              "areacode": "542200"
            },
            {
              "id": 2708,
              "code": "542224",
              "name": "桑日县",
              "areacode": "542200"
            },
            {
              "id": 2709,
              "code": "542225",
              "name": "琼结县",
              "areacode": "542200"
            },
            {
              "id": 2710,
              "code": "542226",
              "name": "曲松县",
              "areacode": "542200"
            },
            {
              "id": 2711,
              "code": "542227",
              "name": "措美县",
              "areacode": "542200"
            },
            {
              "id": 2712,
              "code": "542228",
              "name": "洛扎县",
              "areacode": "542200"
            },
            {
              "id": 2713,
              "code": "542229",
              "name": "加查县",
              "areacode": "542200"
            },
            {
              "id": 2714,
              "code": "542231",
              "name": "隆子县",
              "areacode": "542200"
            },
            {
              "id": 2715,
              "code": "542232",
              "name": "错那县",
              "areacode": "542200"
            },
            {
              "id": 2716,
              "code": "542233",
              "name": "浪卡子县",
              "areacode": "542200"
            }
          ]
        },
        {
          "id": 290,
          "code": "542300",
          "name": "日喀则地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2717,
              "code": "542301",
              "name": "日喀则市",
              "areacode": "542300"
            },
            {
              "id": 2718,
              "code": "542322",
              "name": "南木林县",
              "areacode": "542300"
            },
            {
              "id": 2719,
              "code": "542323",
              "name": "江孜县",
              "areacode": "542300"
            },
            {
              "id": 2720,
              "code": "542324",
              "name": "定日县",
              "areacode": "542300"
            },
            {
              "id": 2721,
              "code": "542325",
              "name": "萨迦县",
              "areacode": "542300"
            },
            {
              "id": 2722,
              "code": "542326",
              "name": "拉孜县",
              "areacode": "542300"
            },
            {
              "id": 2723,
              "code": "542327",
              "name": "昂仁县",
              "areacode": "542300"
            },
            {
              "id": 2724,
              "code": "542328",
              "name": "谢通门县",
              "areacode": "542300"
            },
            {
              "id": 2725,
              "code": "542329",
              "name": "白朗县",
              "areacode": "542300"
            },
            {
              "id": 2726,
              "code": "542330",
              "name": "仁布县",
              "areacode": "542300"
            },
            {
              "id": 2727,
              "code": "542331",
              "name": "康马县",
              "areacode": "542300"
            },
            {
              "id": 2728,
              "code": "542332",
              "name": "定结县",
              "areacode": "542300"
            },
            {
              "id": 2729,
              "code": "542333",
              "name": "仲巴县",
              "areacode": "542300"
            },
            {
              "id": 2730,
              "code": "542334",
              "name": "亚东县",
              "areacode": "542300"
            },
            {
              "id": 2731,
              "code": "542335",
              "name": "吉隆县",
              "areacode": "542300"
            },
            {
              "id": 2732,
              "code": "542336",
              "name": "聂拉木县",
              "areacode": "542300"
            },
            {
              "id": 2733,
              "code": "542337",
              "name": "萨嘎县",
              "areacode": "542300"
            },
            {
              "id": 2734,
              "code": "542338",
              "name": "岗巴县",
              "areacode": "542300"
            }
          ]
        },
        {
          "id": 291,
          "code": "542400",
          "name": "那曲地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2735,
              "code": "542421",
              "name": "那曲县",
              "areacode": "542400"
            },
            {
              "id": 2736,
              "code": "542422",
              "name": "嘉黎县",
              "areacode": "542400"
            },
            {
              "id": 2737,
              "code": "542423",
              "name": "比如县",
              "areacode": "542400"
            },
            {
              "id": 2738,
              "code": "542424",
              "name": "聂荣县",
              "areacode": "542400"
            },
            {
              "id": 2739,
              "code": "542425",
              "name": "安多县",
              "areacode": "542400"
            },
            {
              "id": 2740,
              "code": "542426",
              "name": "申扎县",
              "areacode": "542400"
            },
            {
              "id": 2741,
              "code": "542427",
              "name": "索　县",
              "areacode": "542400"
            },
            {
              "id": 2742,
              "code": "542428",
              "name": "班戈县",
              "areacode": "542400"
            },
            {
              "id": 2743,
              "code": "542429",
              "name": "巴青县",
              "areacode": "542400"
            },
            {
              "id": 2744,
              "code": "542430",
              "name": "尼玛县",
              "areacode": "542400"
            }
          ]
        },
        {
          "id": 292,
          "code": "542500",
          "name": "阿里地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2745,
              "code": "542521",
              "name": "普兰县",
              "areacode": "542500"
            },
            {
              "id": 2746,
              "code": "542522",
              "name": "札达县",
              "areacode": "542500"
            },
            {
              "id": 2747,
              "code": "542523",
              "name": "噶尔县",
              "areacode": "542500"
            },
            {
              "id": 2748,
              "code": "542524",
              "name": "日土县",
              "areacode": "542500"
            },
            {
              "id": 2749,
              "code": "542525",
              "name": "革吉县",
              "areacode": "542500"
            },
            {
              "id": 2750,
              "code": "542526",
              "name": "改则县",
              "areacode": "542500"
            },
            {
              "id": 2751,
              "code": "542527",
              "name": "措勤县",
              "areacode": "542500"
            }
          ]
        },
        {
          "id": 293,
          "code": "542600",
          "name": "林芝地区",
          "citycode": "540000",
          "district": [
            {
              "id": 2752,
              "code": "542621",
              "name": "林芝县",
              "areacode": "542600"
            },
            {
              "id": 2753,
              "code": "542622",
              "name": "工布江达县",
              "areacode": "542600"
            },
            {
              "id": 2754,
              "code": "542623",
              "name": "米林县",
              "areacode": "542600"
            },
            {
              "id": 2755,
              "code": "542624",
              "name": "墨脱县",
              "areacode": "542600"
            },
            {
              "id": 2756,
              "code": "542625",
              "name": "波密县",
              "areacode": "542600"
            },
            {
              "id": 2757,
              "code": "542626",
              "name": "察隅县",
              "areacode": "542600"
            },
            {
              "id": 2758,
              "code": "542627",
              "name": "朗　县",
              "areacode": "542600"
            }
          ]
        }
      ]
    },
    {
      "id": 27,
      "code": "610000",
      "name": "陕西省",
      "city": [
        {
          "id": 294,
          "code": "610100",
          "name": "西安市",
          "citycode": "610000",
          "district": [
            {
              "id": 2759,
              "code": "610101",
              "name": "市辖区",
              "areacode": "610100"
            },
            {
              "id": 2760,
              "code": "610102",
              "name": "新城区",
              "areacode": "610100"
            },
            {
              "id": 2761,
              "code": "610103",
              "name": "碑林区",
              "areacode": "610100"
            },
            {
              "id": 2762,
              "code": "610104",
              "name": "莲湖区",
              "areacode": "610100"
            },
            {
              "id": 2763,
              "code": "610111",
              "name": "灞桥区",
              "areacode": "610100"
            },
            {
              "id": 2764,
              "code": "610112",
              "name": "未央区",
              "areacode": "610100"
            },
            {
              "id": 2765,
              "code": "610113",
              "name": "雁塔区",
              "areacode": "610100"
            },
            {
              "id": 2766,
              "code": "610114",
              "name": "阎良区",
              "areacode": "610100"
            },
            {
              "id": 2767,
              "code": "610115",
              "name": "临潼区",
              "areacode": "610100"
            },
            {
              "id": 2768,
              "code": "610116",
              "name": "长安区",
              "areacode": "610100"
            },
            {
              "id": 2769,
              "code": "610122",
              "name": "蓝田县",
              "areacode": "610100"
            },
            {
              "id": 2770,
              "code": "610124",
              "name": "周至县",
              "areacode": "610100"
            },
            {
              "id": 2771,
              "code": "610125",
              "name": "户　县",
              "areacode": "610100"
            },
            {
              "id": 2772,
              "code": "610126",
              "name": "高陵县",
              "areacode": "610100"
            }
          ]
        },
        {
          "id": 295,
          "code": "610200",
          "name": "铜川市",
          "citycode": "610000",
          "district": [
            {
              "id": 2773,
              "code": "610201",
              "name": "市辖区",
              "areacode": "610200"
            },
            {
              "id": 2774,
              "code": "610202",
              "name": "王益区",
              "areacode": "610200"
            },
            {
              "id": 2775,
              "code": "610203",
              "name": "印台区",
              "areacode": "610200"
            },
            {
              "id": 2776,
              "code": "610204",
              "name": "耀州区",
              "areacode": "610200"
            },
            {
              "id": 2777,
              "code": "610222",
              "name": "宜君县",
              "areacode": "610200"
            }
          ]
        },
        {
          "id": 296,
          "code": "610300",
          "name": "宝鸡市",
          "citycode": "610000",
          "district": [
            {
              "id": 2778,
              "code": "610301",
              "name": "市辖区",
              "areacode": "610300"
            },
            {
              "id": 2779,
              "code": "610302",
              "name": "渭滨区",
              "areacode": "610300"
            },
            {
              "id": 2780,
              "code": "610303",
              "name": "金台区",
              "areacode": "610300"
            },
            {
              "id": 2781,
              "code": "610304",
              "name": "陈仓区",
              "areacode": "610300"
            },
            {
              "id": 2782,
              "code": "610322",
              "name": "凤翔县",
              "areacode": "610300"
            },
            {
              "id": 2783,
              "code": "610323",
              "name": "岐山县",
              "areacode": "610300"
            },
            {
              "id": 2784,
              "code": "610324",
              "name": "扶风县",
              "areacode": "610300"
            },
            {
              "id": 2785,
              "code": "610326",
              "name": "眉　县",
              "areacode": "610300"
            },
            {
              "id": 2786,
              "code": "610327",
              "name": "陇　县",
              "areacode": "610300"
            },
            {
              "id": 2787,
              "code": "610328",
              "name": "千阳县",
              "areacode": "610300"
            },
            {
              "id": 2788,
              "code": "610329",
              "name": "麟游县",
              "areacode": "610300"
            },
            {
              "id": 2789,
              "code": "610330",
              "name": "凤　县",
              "areacode": "610300"
            },
            {
              "id": 2790,
              "code": "610331",
              "name": "太白县",
              "areacode": "610300"
            }
          ]
        },
        {
          "id": 297,
          "code": "610400",
          "name": "咸阳市",
          "citycode": "610000",
          "district": [
            {
              "id": 2791,
              "code": "610401",
              "name": "市辖区",
              "areacode": "610400"
            },
            {
              "id": 2792,
              "code": "610402",
              "name": "秦都区",
              "areacode": "610400"
            },
            {
              "id": 2793,
              "code": "610403",
              "name": "杨凌区",
              "areacode": "610400"
            },
            {
              "id": 2794,
              "code": "610404",
              "name": "渭城区",
              "areacode": "610400"
            },
            {
              "id": 2795,
              "code": "610422",
              "name": "三原县",
              "areacode": "610400"
            },
            {
              "id": 2796,
              "code": "610423",
              "name": "泾阳县",
              "areacode": "610400"
            },
            {
              "id": 2797,
              "code": "610424",
              "name": "乾　县",
              "areacode": "610400"
            },
            {
              "id": 2798,
              "code": "610425",
              "name": "礼泉县",
              "areacode": "610400"
            },
            {
              "id": 2799,
              "code": "610426",
              "name": "永寿县",
              "areacode": "610400"
            },
            {
              "id": 2800,
              "code": "610427",
              "name": "彬　县",
              "areacode": "610400"
            },
            {
              "id": 2801,
              "code": "610428",
              "name": "长武县",
              "areacode": "610400"
            },
            {
              "id": 2802,
              "code": "610429",
              "name": "旬邑县",
              "areacode": "610400"
            },
            {
              "id": 2803,
              "code": "610430",
              "name": "淳化县",
              "areacode": "610400"
            },
            {
              "id": 2804,
              "code": "610431",
              "name": "武功县",
              "areacode": "610400"
            },
            {
              "id": 2805,
              "code": "610481",
              "name": "兴平市",
              "areacode": "610400"
            }
          ]
        },
        {
          "id": 298,
          "code": "610500",
          "name": "渭南市",
          "citycode": "610000",
          "district": [
            {
              "id": 2806,
              "code": "610501",
              "name": "市辖区",
              "areacode": "610500"
            },
            {
              "id": 2807,
              "code": "610502",
              "name": "临渭区",
              "areacode": "610500"
            },
            {
              "id": 2808,
              "code": "610521",
              "name": "华　县",
              "areacode": "610500"
            },
            {
              "id": 2809,
              "code": "610522",
              "name": "潼关县",
              "areacode": "610500"
            },
            {
              "id": 2810,
              "code": "610523",
              "name": "大荔县",
              "areacode": "610500"
            },
            {
              "id": 2811,
              "code": "610524",
              "name": "合阳县",
              "areacode": "610500"
            },
            {
              "id": 2812,
              "code": "610525",
              "name": "澄城县",
              "areacode": "610500"
            },
            {
              "id": 2813,
              "code": "610526",
              "name": "蒲城县",
              "areacode": "610500"
            },
            {
              "id": 2814,
              "code": "610527",
              "name": "白水县",
              "areacode": "610500"
            },
            {
              "id": 2815,
              "code": "610528",
              "name": "富平县",
              "areacode": "610500"
            },
            {
              "id": 2816,
              "code": "610581",
              "name": "韩城市",
              "areacode": "610500"
            },
            {
              "id": 2817,
              "code": "610582",
              "name": "华阴市",
              "areacode": "610500"
            }
          ]
        },
        {
          "id": 299,
          "code": "610600",
          "name": "延安市",
          "citycode": "610000",
          "district": [
            {
              "id": 2818,
              "code": "610601",
              "name": "市辖区",
              "areacode": "610600"
            },
            {
              "id": 2819,
              "code": "610602",
              "name": "宝塔区",
              "areacode": "610600"
            },
            {
              "id": 2820,
              "code": "610621",
              "name": "延长县",
              "areacode": "610600"
            },
            {
              "id": 2821,
              "code": "610622",
              "name": "延川县",
              "areacode": "610600"
            },
            {
              "id": 2822,
              "code": "610623",
              "name": "子长县",
              "areacode": "610600"
            },
            {
              "id": 2823,
              "code": "610624",
              "name": "安塞县",
              "areacode": "610600"
            },
            {
              "id": 2824,
              "code": "610625",
              "name": "志丹县",
              "areacode": "610600"
            },
            {
              "id": 2825,
              "code": "610626",
              "name": "吴旗县",
              "areacode": "610600"
            },
            {
              "id": 2826,
              "code": "610627",
              "name": "甘泉县",
              "areacode": "610600"
            },
            {
              "id": 2827,
              "code": "610628",
              "name": "富　县",
              "areacode": "610600"
            },
            {
              "id": 2828,
              "code": "610629",
              "name": "洛川县",
              "areacode": "610600"
            },
            {
              "id": 2829,
              "code": "610630",
              "name": "宜川县",
              "areacode": "610600"
            },
            {
              "id": 2830,
              "code": "610631",
              "name": "黄龙县",
              "areacode": "610600"
            },
            {
              "id": 2831,
              "code": "610632",
              "name": "黄陵县",
              "areacode": "610600"
            }
          ]
        },
        {
          "id": 300,
          "code": "610700",
          "name": "汉中市",
          "citycode": "610000",
          "district": [
            {
              "id": 2832,
              "code": "610701",
              "name": "市辖区",
              "areacode": "610700"
            },
            {
              "id": 2833,
              "code": "610702",
              "name": "汉台区",
              "areacode": "610700"
            },
            {
              "id": 2834,
              "code": "610721",
              "name": "南郑县",
              "areacode": "610700"
            },
            {
              "id": 2835,
              "code": "610722",
              "name": "城固县",
              "areacode": "610700"
            },
            {
              "id": 2836,
              "code": "610723",
              "name": "洋　县",
              "areacode": "610700"
            },
            {
              "id": 2837,
              "code": "610724",
              "name": "西乡县",
              "areacode": "610700"
            },
            {
              "id": 2838,
              "code": "610725",
              "name": "勉　县",
              "areacode": "610700"
            },
            {
              "id": 2839,
              "code": "610726",
              "name": "宁强县",
              "areacode": "610700"
            },
            {
              "id": 2840,
              "code": "610727",
              "name": "略阳县",
              "areacode": "610700"
            },
            {
              "id": 2841,
              "code": "610728",
              "name": "镇巴县",
              "areacode": "610700"
            },
            {
              "id": 2842,
              "code": "610729",
              "name": "留坝县",
              "areacode": "610700"
            },
            {
              "id": 2843,
              "code": "610730",
              "name": "佛坪县",
              "areacode": "610700"
            }
          ]
        },
        {
          "id": 301,
          "code": "610800",
          "name": "榆林市",
          "citycode": "610000",
          "district": [
            {
              "id": 2844,
              "code": "610801",
              "name": "市辖区",
              "areacode": "610800"
            },
            {
              "id": 2845,
              "code": "610802",
              "name": "榆阳区",
              "areacode": "610800"
            },
            {
              "id": 2846,
              "code": "610821",
              "name": "神木县",
              "areacode": "610800"
            },
            {
              "id": 2847,
              "code": "610822",
              "name": "府谷县",
              "areacode": "610800"
            },
            {
              "id": 2848,
              "code": "610823",
              "name": "横山县",
              "areacode": "610800"
            },
            {
              "id": 2849,
              "code": "610824",
              "name": "靖边县",
              "areacode": "610800"
            },
            {
              "id": 2850,
              "code": "610825",
              "name": "定边县",
              "areacode": "610800"
            },
            {
              "id": 2851,
              "code": "610826",
              "name": "绥德县",
              "areacode": "610800"
            },
            {
              "id": 2852,
              "code": "610827",
              "name": "米脂县",
              "areacode": "610800"
            },
            {
              "id": 2853,
              "code": "610828",
              "name": "佳　县",
              "areacode": "610800"
            },
            {
              "id": 2854,
              "code": "610829",
              "name": "吴堡县",
              "areacode": "610800"
            },
            {
              "id": 2855,
              "code": "610830",
              "name": "清涧县",
              "areacode": "610800"
            },
            {
              "id": 2856,
              "code": "610831",
              "name": "子洲县",
              "areacode": "610800"
            }
          ]
        },
        {
          "id": 302,
          "code": "610900",
          "name": "安康市",
          "citycode": "610000",
          "district": [
            {
              "id": 2857,
              "code": "610901",
              "name": "市辖区",
              "areacode": "610900"
            },
            {
              "id": 2858,
              "code": "610902",
              "name": "汉滨区",
              "areacode": "610900"
            },
            {
              "id": 2859,
              "code": "610921",
              "name": "汉阴县",
              "areacode": "610900"
            },
            {
              "id": 2860,
              "code": "610922",
              "name": "石泉县",
              "areacode": "610900"
            },
            {
              "id": 2861,
              "code": "610923",
              "name": "宁陕县",
              "areacode": "610900"
            },
            {
              "id": 2862,
              "code": "610924",
              "name": "紫阳县",
              "areacode": "610900"
            },
            {
              "id": 2863,
              "code": "610925",
              "name": "岚皋县",
              "areacode": "610900"
            },
            {
              "id": 2864,
              "code": "610926",
              "name": "平利县",
              "areacode": "610900"
            },
            {
              "id": 2865,
              "code": "610927",
              "name": "镇坪县",
              "areacode": "610900"
            },
            {
              "id": 2866,
              "code": "610928",
              "name": "旬阳县",
              "areacode": "610900"
            },
            {
              "id": 2867,
              "code": "610929",
              "name": "白河县",
              "areacode": "610900"
            }
          ]
        },
        {
          "id": 303,
          "code": "611000",
          "name": "商洛市",
          "citycode": "610000",
          "district": [
            {
              "id": 2868,
              "code": "611001",
              "name": "市辖区",
              "areacode": "611000"
            },
            {
              "id": 2869,
              "code": "611002",
              "name": "商州区",
              "areacode": "611000"
            },
            {
              "id": 2870,
              "code": "611021",
              "name": "洛南县",
              "areacode": "611000"
            },
            {
              "id": 2871,
              "code": "611022",
              "name": "丹凤县",
              "areacode": "611000"
            },
            {
              "id": 2872,
              "code": "611023",
              "name": "商南县",
              "areacode": "611000"
            },
            {
              "id": 2873,
              "code": "611024",
              "name": "山阳县",
              "areacode": "611000"
            },
            {
              "id": 2874,
              "code": "611025",
              "name": "镇安县",
              "areacode": "611000"
            },
            {
              "id": 2875,
              "code": "611026",
              "name": "柞水县",
              "areacode": "611000"
            }
          ]
        }
      ]
    },
    {
      "id": 28,
      "code": "620000",
      "name": "甘肃省",
      "city": [
        {
          "id": 304,
          "code": "620100",
          "name": "兰州市",
          "citycode": "620000",
          "district": [
            {
              "id": 2876,
              "code": "620101",
              "name": "市辖区",
              "areacode": "620100"
            },
            {
              "id": 2877,
              "code": "620102",
              "name": "城关区",
              "areacode": "620100"
            },
            {
              "id": 2878,
              "code": "620103",
              "name": "七里河区",
              "areacode": "620100"
            },
            {
              "id": 2879,
              "code": "620104",
              "name": "西固区",
              "areacode": "620100"
            },
            {
              "id": 2880,
              "code": "620105",
              "name": "安宁区",
              "areacode": "620100"
            },
            {
              "id": 2881,
              "code": "620111",
              "name": "红古区",
              "areacode": "620100"
            },
            {
              "id": 2882,
              "code": "620121",
              "name": "永登县",
              "areacode": "620100"
            },
            {
              "id": 2883,
              "code": "620122",
              "name": "皋兰县",
              "areacode": "620100"
            },
            {
              "id": 2884,
              "code": "620123",
              "name": "榆中县",
              "areacode": "620100"
            }
          ]
        },
        {
          "id": 305,
          "code": "620200",
          "name": "嘉峪关市",
          "citycode": "620000",
          "district": [
            {
              "id": 2885,
              "code": "620201",
              "name": "市辖区",
              "areacode": "620200"
            }
          ]
        },
        {
          "id": 306,
          "code": "620300",
          "name": "金昌市",
          "citycode": "620000",
          "district": [
            {
              "id": 2886,
              "code": "620301",
              "name": "市辖区",
              "areacode": "620300"
            },
            {
              "id": 2887,
              "code": "620302",
              "name": "金川区",
              "areacode": "620300"
            },
            {
              "id": 2888,
              "code": "620321",
              "name": "永昌县",
              "areacode": "620300"
            }
          ]
        },
        {
          "id": 307,
          "code": "620400",
          "name": "白银市",
          "citycode": "620000",
          "district": [
            {
              "id": 2889,
              "code": "620401",
              "name": "市辖区",
              "areacode": "620400"
            },
            {
              "id": 2890,
              "code": "620402",
              "name": "白银区",
              "areacode": "620400"
            },
            {
              "id": 2891,
              "code": "620403",
              "name": "平川区",
              "areacode": "620400"
            },
            {
              "id": 2892,
              "code": "620421",
              "name": "靖远县",
              "areacode": "620400"
            },
            {
              "id": 2893,
              "code": "620422",
              "name": "会宁县",
              "areacode": "620400"
            },
            {
              "id": 2894,
              "code": "620423",
              "name": "景泰县",
              "areacode": "620400"
            }
          ]
        },
        {
          "id": 308,
          "code": "620500",
          "name": "天水市",
          "citycode": "620000",
          "district": [
            {
              "id": 2895,
              "code": "620501",
              "name": "市辖区",
              "areacode": "620500"
            },
            {
              "id": 2896,
              "code": "620502",
              "name": "秦城区",
              "areacode": "620500"
            },
            {
              "id": 2897,
              "code": "620503",
              "name": "北道区",
              "areacode": "620500"
            },
            {
              "id": 2898,
              "code": "620521",
              "name": "清水县",
              "areacode": "620500"
            },
            {
              "id": 2899,
              "code": "620522",
              "name": "秦安县",
              "areacode": "620500"
            },
            {
              "id": 2900,
              "code": "620523",
              "name": "甘谷县",
              "areacode": "620500"
            },
            {
              "id": 2901,
              "code": "620524",
              "name": "武山县",
              "areacode": "620500"
            },
            {
              "id": 2902,
              "code": "620525",
              "name": "张家川回族自治县",
              "areacode": "620500"
            }
          ]
        },
        {
          "id": 309,
          "code": "620600",
          "name": "武威市",
          "citycode": "620000",
          "district": [
            {
              "id": 2903,
              "code": "620601",
              "name": "市辖区",
              "areacode": "620600"
            },
            {
              "id": 2904,
              "code": "620602",
              "name": "凉州区",
              "areacode": "620600"
            },
            {
              "id": 2905,
              "code": "620621",
              "name": "民勤县",
              "areacode": "620600"
            },
            {
              "id": 2906,
              "code": "620622",
              "name": "古浪县",
              "areacode": "620600"
            },
            {
              "id": 2907,
              "code": "620623",
              "name": "天祝藏族自治县",
              "areacode": "620600"
            }
          ]
        },
        {
          "id": 310,
          "code": "620700",
          "name": "张掖市",
          "citycode": "620000",
          "district": [
            {
              "id": 2908,
              "code": "620701",
              "name": "市辖区",
              "areacode": "620700"
            },
            {
              "id": 2909,
              "code": "620702",
              "name": "甘州区",
              "areacode": "620700"
            },
            {
              "id": 2910,
              "code": "620721",
              "name": "肃南裕固族自治县",
              "areacode": "620700"
            },
            {
              "id": 2911,
              "code": "620722",
              "name": "民乐县",
              "areacode": "620700"
            },
            {
              "id": 2912,
              "code": "620723",
              "name": "临泽县",
              "areacode": "620700"
            },
            {
              "id": 2913,
              "code": "620724",
              "name": "高台县",
              "areacode": "620700"
            },
            {
              "id": 2914,
              "code": "620725",
              "name": "山丹县",
              "areacode": "620700"
            }
          ]
        },
        {
          "id": 311,
          "code": "620800",
          "name": "平凉市",
          "citycode": "620000",
          "district": [
            {
              "id": 2915,
              "code": "620801",
              "name": "市辖区",
              "areacode": "620800"
            },
            {
              "id": 2916,
              "code": "620802",
              "name": "崆峒区",
              "areacode": "620800"
            },
            {
              "id": 2917,
              "code": "620821",
              "name": "泾川县",
              "areacode": "620800"
            },
            {
              "id": 2918,
              "code": "620822",
              "name": "灵台县",
              "areacode": "620800"
            },
            {
              "id": 2919,
              "code": "620823",
              "name": "崇信县",
              "areacode": "620800"
            },
            {
              "id": 2920,
              "code": "620824",
              "name": "华亭县",
              "areacode": "620800"
            },
            {
              "id": 2921,
              "code": "620825",
              "name": "庄浪县",
              "areacode": "620800"
            },
            {
              "id": 2922,
              "code": "620826",
              "name": "静宁县",
              "areacode": "620800"
            }
          ]
        },
        {
          "id": 312,
          "code": "620900",
          "name": "酒泉市",
          "citycode": "620000",
          "district": [
            {
              "id": 2923,
              "code": "620901",
              "name": "市辖区",
              "areacode": "620900"
            },
            {
              "id": 2924,
              "code": "620902",
              "name": "肃州区",
              "areacode": "620900"
            },
            {
              "id": 2925,
              "code": "620921",
              "name": "金塔县",
              "areacode": "620900"
            },
            {
              "id": 2926,
              "code": "620922",
              "name": "安西县",
              "areacode": "620900"
            },
            {
              "id": 2927,
              "code": "620923",
              "name": "肃北蒙古族自治县",
              "areacode": "620900"
            },
            {
              "id": 2928,
              "code": "620924",
              "name": "阿克塞哈萨克族自治县",
              "areacode": "620900"
            },
            {
              "id": 2929,
              "code": "620981",
              "name": "玉门市",
              "areacode": "620900"
            },
            {
              "id": 2930,
              "code": "620982",
              "name": "敦煌市",
              "areacode": "620900"
            }
          ]
        },
        {
          "id": 313,
          "code": "621000",
          "name": "庆阳市",
          "citycode": "620000",
          "district": [
            {
              "id": 2931,
              "code": "621001",
              "name": "市辖区",
              "areacode": "621000"
            },
            {
              "id": 2932,
              "code": "621002",
              "name": "西峰区",
              "areacode": "621000"
            },
            {
              "id": 2933,
              "code": "621021",
              "name": "庆城县",
              "areacode": "621000"
            },
            {
              "id": 2934,
              "code": "621022",
              "name": "环　县",
              "areacode": "621000"
            },
            {
              "id": 2935,
              "code": "621023",
              "name": "华池县",
              "areacode": "621000"
            },
            {
              "id": 2936,
              "code": "621024",
              "name": "合水县",
              "areacode": "621000"
            },
            {
              "id": 2937,
              "code": "621025",
              "name": "正宁县",
              "areacode": "621000"
            },
            {
              "id": 2938,
              "code": "621026",
              "name": "宁　县",
              "areacode": "621000"
            },
            {
              "id": 2939,
              "code": "621027",
              "name": "镇原县",
              "areacode": "621000"
            }
          ]
        },
        {
          "id": 314,
          "code": "621100",
          "name": "定西市",
          "citycode": "620000",
          "district": [
            {
              "id": 2940,
              "code": "621101",
              "name": "市辖区",
              "areacode": "621100"
            },
            {
              "id": 2941,
              "code": "621102",
              "name": "安定区",
              "areacode": "621100"
            },
            {
              "id": 2942,
              "code": "621121",
              "name": "通渭县",
              "areacode": "621100"
            },
            {
              "id": 2943,
              "code": "621122",
              "name": "陇西县",
              "areacode": "621100"
            },
            {
              "id": 2944,
              "code": "621123",
              "name": "渭源县",
              "areacode": "621100"
            },
            {
              "id": 2945,
              "code": "621124",
              "name": "临洮县",
              "areacode": "621100"
            },
            {
              "id": 2946,
              "code": "621125",
              "name": "漳　县",
              "areacode": "621100"
            },
            {
              "id": 2947,
              "code": "621126",
              "name": "岷　县",
              "areacode": "621100"
            }
          ]
        },
        {
          "id": 315,
          "code": "621200",
          "name": "陇南市",
          "citycode": "620000",
          "district": [
            {
              "id": 2948,
              "code": "621201",
              "name": "市辖区",
              "areacode": "621200"
            },
            {
              "id": 2949,
              "code": "621202",
              "name": "武都区",
              "areacode": "621200"
            },
            {
              "id": 2950,
              "code": "621221",
              "name": "成　县",
              "areacode": "621200"
            },
            {
              "id": 2951,
              "code": "621222",
              "name": "文　县",
              "areacode": "621200"
            },
            {
              "id": 2952,
              "code": "621223",
              "name": "宕昌县",
              "areacode": "621200"
            },
            {
              "id": 2953,
              "code": "621224",
              "name": "康　县",
              "areacode": "621200"
            },
            {
              "id": 2954,
              "code": "621225",
              "name": "西和县",
              "areacode": "621200"
            },
            {
              "id": 2955,
              "code": "621226",
              "name": "礼　县",
              "areacode": "621200"
            },
            {
              "id": 2956,
              "code": "621227",
              "name": "徽　县",
              "areacode": "621200"
            },
            {
              "id": 2957,
              "code": "621228",
              "name": "两当县",
              "areacode": "621200"
            }
          ]
        },
        {
          "id": 316,
          "code": "622900",
          "name": "临夏回族自治州",
          "citycode": "620000",
          "district": [
            {
              "id": 2958,
              "code": "622901",
              "name": "临夏市",
              "areacode": "622900"
            },
            {
              "id": 2959,
              "code": "622921",
              "name": "临夏县",
              "areacode": "622900"
            },
            {
              "id": 2960,
              "code": "622922",
              "name": "康乐县",
              "areacode": "622900"
            },
            {
              "id": 2961,
              "code": "622923",
              "name": "永靖县",
              "areacode": "622900"
            },
            {
              "id": 2962,
              "code": "622924",
              "name": "广河县",
              "areacode": "622900"
            },
            {
              "id": 2963,
              "code": "622925",
              "name": "和政县",
              "areacode": "622900"
            },
            {
              "id": 2964,
              "code": "622926",
              "name": "东乡族自治县",
              "areacode": "622900"
            },
            {
              "id": 2965,
              "code": "622927",
              "name": "积石山保安族东乡族撒拉族自治县",
              "areacode": "622900"
            }
          ]
        },
        {
          "id": 317,
          "code": "623000",
          "name": "甘南藏族自治州",
          "citycode": "620000",
          "district": [
            {
              "id": 2966,
              "code": "623001",
              "name": "合作市",
              "areacode": "623000"
            },
            {
              "id": 2967,
              "code": "623021",
              "name": "临潭县",
              "areacode": "623000"
            },
            {
              "id": 2968,
              "code": "623022",
              "name": "卓尼县",
              "areacode": "623000"
            },
            {
              "id": 2969,
              "code": "623023",
              "name": "舟曲县",
              "areacode": "623000"
            },
            {
              "id": 2970,
              "code": "623024",
              "name": "迭部县",
              "areacode": "623000"
            },
            {
              "id": 2971,
              "code": "623025",
              "name": "玛曲县",
              "areacode": "623000"
            },
            {
              "id": 2972,
              "code": "623026",
              "name": "碌曲县",
              "areacode": "623000"
            },
            {
              "id": 2973,
              "code": "623027",
              "name": "夏河县",
              "areacode": "623000"
            }
          ]
        }
      ]
    },
    {
      "id": 29,
      "code": "630000",
      "name": "青海省",
      "city": [
        {
          "id": 318,
          "code": "630100",
          "name": "西宁市",
          "citycode": "630000",
          "district": [
            {
              "id": 2974,
              "code": "630101",
              "name": "市辖区",
              "areacode": "630100"
            },
            {
              "id": 2975,
              "code": "630102",
              "name": "城东区",
              "areacode": "630100"
            },
            {
              "id": 2976,
              "code": "630103",
              "name": "城中区",
              "areacode": "630100"
            },
            {
              "id": 2977,
              "code": "630104",
              "name": "城西区",
              "areacode": "630100"
            },
            {
              "id": 2978,
              "code": "630105",
              "name": "城北区",
              "areacode": "630100"
            },
            {
              "id": 2979,
              "code": "630121",
              "name": "大通回族土族自治县",
              "areacode": "630100"
            },
            {
              "id": 2980,
              "code": "630122",
              "name": "湟中县",
              "areacode": "630100"
            },
            {
              "id": 2981,
              "code": "630123",
              "name": "湟源县",
              "areacode": "630100"
            }
          ]
        },
        {
          "id": 319,
          "code": "632100",
          "name": "海东地区",
          "citycode": "630000",
          "district": [
            {
              "id": 2982,
              "code": "632121",
              "name": "平安县",
              "areacode": "632100"
            },
            {
              "id": 2983,
              "code": "632122",
              "name": "民和回族土族自治县",
              "areacode": "632100"
            },
            {
              "id": 2984,
              "code": "632123",
              "name": "乐都县",
              "areacode": "632100"
            },
            {
              "id": 2985,
              "code": "632126",
              "name": "互助土族自治县",
              "areacode": "632100"
            },
            {
              "id": 2986,
              "code": "632127",
              "name": "化隆回族自治县",
              "areacode": "632100"
            },
            {
              "id": 2987,
              "code": "632128",
              "name": "循化撒拉族自治县",
              "areacode": "632100"
            }
          ]
        },
        {
          "id": 320,
          "code": "632200",
          "name": "海北藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 2988,
              "code": "632221",
              "name": "门源回族自治县",
              "areacode": "632200"
            },
            {
              "id": 2989,
              "code": "632222",
              "name": "祁连县",
              "areacode": "632200"
            },
            {
              "id": 2990,
              "code": "632223",
              "name": "海晏县",
              "areacode": "632200"
            },
            {
              "id": 2991,
              "code": "632224",
              "name": "刚察县",
              "areacode": "632200"
            }
          ]
        },
        {
          "id": 321,
          "code": "632300",
          "name": "黄南藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 2992,
              "code": "632321",
              "name": "同仁县",
              "areacode": "632300"
            },
            {
              "id": 2993,
              "code": "632322",
              "name": "尖扎县",
              "areacode": "632300"
            },
            {
              "id": 2994,
              "code": "632323",
              "name": "泽库县",
              "areacode": "632300"
            },
            {
              "id": 2995,
              "code": "632324",
              "name": "河南蒙古族自治县",
              "areacode": "632300"
            }
          ]
        },
        {
          "id": 322,
          "code": "632500",
          "name": "海南藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 2996,
              "code": "632521",
              "name": "共和县",
              "areacode": "632500"
            },
            {
              "id": 2997,
              "code": "632522",
              "name": "同德县",
              "areacode": "632500"
            },
            {
              "id": 2998,
              "code": "632523",
              "name": "贵德县",
              "areacode": "632500"
            },
            {
              "id": 2999,
              "code": "632524",
              "name": "兴海县",
              "areacode": "632500"
            },
            {
              "id": 3000,
              "code": "632525",
              "name": "贵南县",
              "areacode": "632500"
            }
          ]
        },
        {
          "id": 323,
          "code": "632600",
          "name": "果洛藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 3001,
              "code": "632621",
              "name": "玛沁县",
              "areacode": "632600"
            },
            {
              "id": 3002,
              "code": "632622",
              "name": "班玛县",
              "areacode": "632600"
            },
            {
              "id": 3003,
              "code": "632623",
              "name": "甘德县",
              "areacode": "632600"
            },
            {
              "id": 3004,
              "code": "632624",
              "name": "达日县",
              "areacode": "632600"
            },
            {
              "id": 3005,
              "code": "632625",
              "name": "久治县",
              "areacode": "632600"
            },
            {
              "id": 3006,
              "code": "632626",
              "name": "玛多县",
              "areacode": "632600"
            }
          ]
        },
        {
          "id": 324,
          "code": "632700",
          "name": "玉树藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 3007,
              "code": "632721",
              "name": "玉树县",
              "areacode": "632700"
            },
            {
              "id": 3008,
              "code": "632722",
              "name": "杂多县",
              "areacode": "632700"
            },
            {
              "id": 3009,
              "code": "632723",
              "name": "称多县",
              "areacode": "632700"
            },
            {
              "id": 3010,
              "code": "632724",
              "name": "治多县",
              "areacode": "632700"
            },
            {
              "id": 3011,
              "code": "632725",
              "name": "囊谦县",
              "areacode": "632700"
            },
            {
              "id": 3012,
              "code": "632726",
              "name": "曲麻莱县",
              "areacode": "632700"
            }
          ]
        },
        {
          "id": 325,
          "code": "632800",
          "name": "海西蒙古族藏族自治州",
          "citycode": "630000",
          "district": [
            {
              "id": 3013,
              "code": "632801",
              "name": "格尔木市",
              "areacode": "632800"
            },
            {
              "id": 3014,
              "code": "632802",
              "name": "德令哈市",
              "areacode": "632800"
            },
            {
              "id": 3015,
              "code": "632821",
              "name": "乌兰县",
              "areacode": "632800"
            },
            {
              "id": 3016,
              "code": "632822",
              "name": "都兰县",
              "areacode": "632800"
            },
            {
              "id": 3017,
              "code": "632823",
              "name": "天峻县",
              "areacode": "632800"
            }
          ]
        }
      ]
    },
    {
      "id": 30,
      "code": "640000",
      "name": "宁夏回族自治区",
      "city": [
        {
          "id": 326,
          "code": "640100",
          "name": "银川市",
          "citycode": "640000",
          "district": [
            {
              "id": 3018,
              "code": "640101",
              "name": "市辖区",
              "areacode": "640100"
            },
            {
              "id": 3019,
              "code": "640104",
              "name": "兴庆区",
              "areacode": "640100"
            },
            {
              "id": 3020,
              "code": "640105",
              "name": "西夏区",
              "areacode": "640100"
            },
            {
              "id": 3021,
              "code": "640106",
              "name": "金凤区",
              "areacode": "640100"
            },
            {
              "id": 3022,
              "code": "640121",
              "name": "永宁县",
              "areacode": "640100"
            },
            {
              "id": 3023,
              "code": "640122",
              "name": "贺兰县",
              "areacode": "640100"
            },
            {
              "id": 3024,
              "code": "640181",
              "name": "灵武市",
              "areacode": "640100"
            }
          ]
        },
        {
          "id": 327,
          "code": "640200",
          "name": "石嘴山市",
          "citycode": "640000",
          "district": [
            {
              "id": 3025,
              "code": "640201",
              "name": "市辖区",
              "areacode": "640200"
            },
            {
              "id": 3026,
              "code": "640202",
              "name": "大武口区",
              "areacode": "640200"
            },
            {
              "id": 3027,
              "code": "640205",
              "name": "惠农区",
              "areacode": "640200"
            },
            {
              "id": 3028,
              "code": "640221",
              "name": "平罗县",
              "areacode": "640200"
            }
          ]
        },
        {
          "id": 328,
          "code": "640300",
          "name": "吴忠市",
          "citycode": "640000",
          "district": [
            {
              "id": 3029,
              "code": "640301",
              "name": "市辖区",
              "areacode": "640300"
            },
            {
              "id": 3030,
              "code": "640302",
              "name": "利通区",
              "areacode": "640300"
            },
            {
              "id": 3031,
              "code": "640323",
              "name": "盐池县",
              "areacode": "640300"
            },
            {
              "id": 3032,
              "code": "640324",
              "name": "同心县",
              "areacode": "640300"
            },
            {
              "id": 3033,
              "code": "640381",
              "name": "青铜峡市",
              "areacode": "640300"
            }
          ]
        },
        {
          "id": 329,
          "code": "640400",
          "name": "固原市",
          "citycode": "640000",
          "district": [
            {
              "id": 3034,
              "code": "640401",
              "name": "市辖区",
              "areacode": "640400"
            },
            {
              "id": 3035,
              "code": "640402",
              "name": "原州区",
              "areacode": "640400"
            },
            {
              "id": 3036,
              "code": "640422",
              "name": "西吉县",
              "areacode": "640400"
            },
            {
              "id": 3037,
              "code": "640423",
              "name": "隆德县",
              "areacode": "640400"
            },
            {
              "id": 3038,
              "code": "640424",
              "name": "泾源县",
              "areacode": "640400"
            },
            {
              "id": 3039,
              "code": "640425",
              "name": "彭阳县",
              "areacode": "640400"
            },
            {
              "id": 3043,
              "code": "640522",
              "name": "海原县",
              "areacode": "640400"
            }
          ]
        },
        {
          "id": 330,
          "code": "640500",
          "name": "中卫市",
          "citycode": "640000",
          "district": [
            {
              "id": 3040,
              "code": "640501",
              "name": "市辖区",
              "areacode": "640500"
            },
            {
              "id": 3041,
              "code": "640502",
              "name": "沙坡头区",
              "areacode": "640500"
            },
            {
              "id": 3042,
              "code": "640521",
              "name": "中宁县",
              "areacode": "640500"
            }
          ]
        }
      ]
    },
    {
      "id": 31,
      "code": "650000",
      "name": "新疆维吾尔自治区",
      "city": [
        {
          "id": 331,
          "code": "650100",
          "name": "乌鲁木齐市",
          "citycode": "650000",
          "district": [
            {
              "id": 3044,
              "code": "650101",
              "name": "市辖区",
              "areacode": "650100"
            },
            {
              "id": 3045,
              "code": "650102",
              "name": "天山区",
              "areacode": "650100"
            },
            {
              "id": 3046,
              "code": "650103",
              "name": "沙依巴克区",
              "areacode": "650100"
            },
            {
              "id": 3047,
              "code": "650104",
              "name": "新市区",
              "areacode": "650100"
            },
            {
              "id": 3048,
              "code": "650105",
              "name": "水磨沟区",
              "areacode": "650100"
            },
            {
              "id": 3049,
              "code": "650106",
              "name": "头屯河区",
              "areacode": "650100"
            },
            {
              "id": 3050,
              "code": "650107",
              "name": "达坂城区",
              "areacode": "650100"
            },
            {
              "id": 3051,
              "code": "650108",
              "name": "东山区",
              "areacode": "650100"
            },
            {
              "id": 3052,
              "code": "650121",
              "name": "乌鲁木齐县",
              "areacode": "650100"
            }
          ]
        },
        {
          "id": 332,
          "code": "650200",
          "name": "克拉玛依市",
          "citycode": "650000",
          "district": [
            {
              "id": 3053,
              "code": "650201",
              "name": "市辖区",
              "areacode": "650200"
            },
            {
              "id": 3054,
              "code": "650202",
              "name": "独山子区",
              "areacode": "650200"
            },
            {
              "id": 3055,
              "code": "650203",
              "name": "克拉玛依区",
              "areacode": "650200"
            },
            {
              "id": 3056,
              "code": "650204",
              "name": "白碱滩区",
              "areacode": "650200"
            },
            {
              "id": 3057,
              "code": "650205",
              "name": "乌尔禾区",
              "areacode": "650200"
            }
          ]
        },
        {
          "id": 333,
          "code": "652100",
          "name": "吐鲁番地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3058,
              "code": "652101",
              "name": "吐鲁番市",
              "areacode": "652100"
            },
            {
              "id": 3059,
              "code": "652122",
              "name": "鄯善县",
              "areacode": "652100"
            },
            {
              "id": 3060,
              "code": "652123",
              "name": "托克逊县",
              "areacode": "652100"
            }
          ]
        },
        {
          "id": 334,
          "code": "652200",
          "name": "哈密地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3061,
              "code": "652201",
              "name": "哈密市",
              "areacode": "652200"
            },
            {
              "id": 3062,
              "code": "652222",
              "name": "巴里坤哈萨克自治县",
              "areacode": "652200"
            },
            {
              "id": 3063,
              "code": "652223",
              "name": "伊吾县",
              "areacode": "652200"
            }
          ]
        },
        {
          "id": 335,
          "code": "652300",
          "name": "昌吉回族自治州",
          "citycode": "650000",
          "district": [
            {
              "id": 3064,
              "code": "652301",
              "name": "昌吉市",
              "areacode": "652300"
            },
            {
              "id": 3065,
              "code": "652302",
              "name": "阜康市",
              "areacode": "652300"
            },
            {
              "id": 3066,
              "code": "652303",
              "name": "米泉市",
              "areacode": "652300"
            },
            {
              "id": 3067,
              "code": "652323",
              "name": "呼图壁县",
              "areacode": "652300"
            },
            {
              "id": 3068,
              "code": "652324",
              "name": "玛纳斯县",
              "areacode": "652300"
            },
            {
              "id": 3069,
              "code": "652325",
              "name": "奇台县",
              "areacode": "652300"
            },
            {
              "id": 3070,
              "code": "652327",
              "name": "吉木萨尔县",
              "areacode": "652300"
            },
            {
              "id": 3071,
              "code": "652328",
              "name": "木垒哈萨克自治县",
              "areacode": "652300"
            }
          ]
        },
        {
          "id": 336,
          "code": "652700",
          "name": "博尔塔拉蒙古自治州",
          "citycode": "650000",
          "district": [
            {
              "id": 3072,
              "code": "652701",
              "name": "博乐市",
              "areacode": "652700"
            },
            {
              "id": 3073,
              "code": "652722",
              "name": "精河县",
              "areacode": "652700"
            },
            {
              "id": 3074,
              "code": "652723",
              "name": "温泉县",
              "areacode": "652700"
            }
          ]
        },
        {
          "id": 337,
          "code": "652800",
          "name": "巴音郭楞蒙古自治州",
          "citycode": "650000",
          "district": [
            {
              "id": 3075,
              "code": "652801",
              "name": "库尔勒市",
              "areacode": "652800"
            },
            {
              "id": 3076,
              "code": "652822",
              "name": "轮台县",
              "areacode": "652800"
            },
            {
              "id": 3077,
              "code": "652823",
              "name": "尉犁县",
              "areacode": "652800"
            },
            {
              "id": 3078,
              "code": "652824",
              "name": "若羌县",
              "areacode": "652800"
            },
            {
              "id": 3079,
              "code": "652825",
              "name": "且末县",
              "areacode": "652800"
            },
            {
              "id": 3080,
              "code": "652826",
              "name": "焉耆回族自治县",
              "areacode": "652800"
            },
            {
              "id": 3081,
              "code": "652827",
              "name": "和静县",
              "areacode": "652800"
            },
            {
              "id": 3082,
              "code": "652828",
              "name": "和硕县",
              "areacode": "652800"
            },
            {
              "id": 3083,
              "code": "652829",
              "name": "博湖县",
              "areacode": "652800"
            }
          ]
        },
        {
          "id": 338,
          "code": "652900",
          "name": "阿克苏地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3084,
              "code": "652901",
              "name": "阿克苏市",
              "areacode": "652900"
            },
            {
              "id": 3085,
              "code": "652922",
              "name": "温宿县",
              "areacode": "652900"
            },
            {
              "id": 3086,
              "code": "652923",
              "name": "库车县",
              "areacode": "652900"
            },
            {
              "id": 3087,
              "code": "652924",
              "name": "沙雅县",
              "areacode": "652900"
            },
            {
              "id": 3088,
              "code": "652925",
              "name": "新和县",
              "areacode": "652900"
            },
            {
              "id": 3089,
              "code": "652926",
              "name": "拜城县",
              "areacode": "652900"
            },
            {
              "id": 3090,
              "code": "652927",
              "name": "乌什县",
              "areacode": "652900"
            },
            {
              "id": 3091,
              "code": "652928",
              "name": "阿瓦提县",
              "areacode": "652900"
            },
            {
              "id": 3092,
              "code": "652929",
              "name": "柯坪县",
              "areacode": "652900"
            }
          ]
        },
        {
          "id": 339,
          "code": "653000",
          "name": "克孜勒苏柯尔克孜自治州",
          "citycode": "650000",
          "district": [
            {
              "id": 3093,
              "code": "653001",
              "name": "阿图什市",
              "areacode": "653000"
            },
            {
              "id": 3094,
              "code": "653022",
              "name": "阿克陶县",
              "areacode": "653000"
            },
            {
              "id": 3095,
              "code": "653023",
              "name": "阿合奇县",
              "areacode": "653000"
            },
            {
              "id": 3096,
              "code": "653024",
              "name": "乌恰县",
              "areacode": "653000"
            }
          ]
        },
        {
          "id": 340,
          "code": "653100",
          "name": "喀什地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3097,
              "code": "653101",
              "name": "喀什市",
              "areacode": "653100"
            },
            {
              "id": 3098,
              "code": "653121",
              "name": "疏附县",
              "areacode": "653100"
            },
            {
              "id": 3099,
              "code": "653122",
              "name": "疏勒县",
              "areacode": "653100"
            },
            {
              "id": 3100,
              "code": "653123",
              "name": "英吉沙县",
              "areacode": "653100"
            },
            {
              "id": 3101,
              "code": "653124",
              "name": "泽普县",
              "areacode": "653100"
            },
            {
              "id": 3102,
              "code": "653125",
              "name": "莎车县",
              "areacode": "653100"
            },
            {
              "id": 3103,
              "code": "653126",
              "name": "叶城县",
              "areacode": "653100"
            },
            {
              "id": 3104,
              "code": "653127",
              "name": "麦盖提县",
              "areacode": "653100"
            },
            {
              "id": 3105,
              "code": "653128",
              "name": "岳普湖县",
              "areacode": "653100"
            },
            {
              "id": 3106,
              "code": "653129",
              "name": "伽师县",
              "areacode": "653100"
            },
            {
              "id": 3107,
              "code": "653130",
              "name": "巴楚县",
              "areacode": "653100"
            },
            {
              "id": 3108,
              "code": "653131",
              "name": "塔什库尔干塔吉克自治县",
              "areacode": "653100"
            }
          ]
        },
        {
          "id": 341,
          "code": "653200",
          "name": "和田地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3109,
              "code": "653201",
              "name": "和田市",
              "areacode": "653200"
            },
            {
              "id": 3110,
              "code": "653221",
              "name": "和田县",
              "areacode": "653200"
            },
            {
              "id": 3111,
              "code": "653222",
              "name": "墨玉县",
              "areacode": "653200"
            },
            {
              "id": 3112,
              "code": "653223",
              "name": "皮山县",
              "areacode": "653200"
            },
            {
              "id": 3113,
              "code": "653224",
              "name": "洛浦县",
              "areacode": "653200"
            },
            {
              "id": 3114,
              "code": "653225",
              "name": "策勒县",
              "areacode": "653200"
            },
            {
              "id": 3115,
              "code": "653226",
              "name": "于田县",
              "areacode": "653200"
            },
            {
              "id": 3116,
              "code": "653227",
              "name": "民丰县",
              "areacode": "653200"
            }
          ]
        },
        {
          "id": 342,
          "code": "654000",
          "name": "伊犁哈萨克自治州",
          "citycode": "650000",
          "district": [
            {
              "id": 3117,
              "code": "654002",
              "name": "伊宁市",
              "areacode": "654000"
            },
            {
              "id": 3118,
              "code": "654003",
              "name": "奎屯市",
              "areacode": "654000"
            },
            {
              "id": 3119,
              "code": "654021",
              "name": "伊宁县",
              "areacode": "654000"
            },
            {
              "id": 3120,
              "code": "654022",
              "name": "察布查尔锡伯自治县",
              "areacode": "654000"
            },
            {
              "id": 3121,
              "code": "654023",
              "name": "霍城县",
              "areacode": "654000"
            },
            {
              "id": 3122,
              "code": "654024",
              "name": "巩留县",
              "areacode": "654000"
            },
            {
              "id": 3123,
              "code": "654025",
              "name": "新源县",
              "areacode": "654000"
            },
            {
              "id": 3124,
              "code": "654026",
              "name": "昭苏县",
              "areacode": "654000"
            },
            {
              "id": 3125,
              "code": "654027",
              "name": "特克斯县",
              "areacode": "654000"
            },
            {
              "id": 3126,
              "code": "654028",
              "name": "尼勒克县",
              "areacode": "654000"
            }
          ]
        },
        {
          "id": 343,
          "code": "654200",
          "name": "塔城地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3127,
              "code": "654201",
              "name": "塔城市",
              "areacode": "654200"
            },
            {
              "id": 3128,
              "code": "654202",
              "name": "乌苏市",
              "areacode": "654200"
            },
            {
              "id": 3129,
              "code": "654221",
              "name": "额敏县",
              "areacode": "654200"
            },
            {
              "id": 3130,
              "code": "654223",
              "name": "沙湾县",
              "areacode": "654200"
            },
            {
              "id": 3131,
              "code": "654224",
              "name": "托里县",
              "areacode": "654200"
            },
            {
              "id": 3132,
              "code": "654225",
              "name": "裕民县",
              "areacode": "654200"
            },
            {
              "id": 3133,
              "code": "654226",
              "name": "和布克赛尔蒙古自治县",
              "areacode": "654200"
            }
          ]
        },
        {
          "id": 344,
          "code": "654300",
          "name": "阿勒泰地区",
          "citycode": "650000",
          "district": [
            {
              "id": 3134,
              "code": "654301",
              "name": "阿勒泰市",
              "areacode": "654300"
            },
            {
              "id": 3135,
              "code": "654321",
              "name": "布尔津县",
              "areacode": "654300"
            },
            {
              "id": 3136,
              "code": "654322",
              "name": "富蕴县",
              "areacode": "654300"
            },
            {
              "id": 3137,
              "code": "654323",
              "name": "福海县",
              "areacode": "654300"
            },
            {
              "id": 3138,
              "code": "654324",
              "name": "哈巴河县",
              "areacode": "654300"
            },
            {
              "id": 3139,
              "code": "654325",
              "name": "青河县",
              "areacode": "654300"
            },
            {
              "id": 3140,
              "code": "654326",
              "name": "吉木乃县",
              "areacode": "654300"
            }
          ]
        },
        {
          "id": 345,
          "code": "659000",
          "name": "省直辖行政单位",
          "citycode": "650000",
          "district": [
            {
              "id": 3141,
              "code": "659001",
              "name": "石河子市",
              "areacode": "659000"
            },
            {
              "id": 3142,
              "code": "659002",
              "name": "阿拉尔市",
              "areacode": "659000"
            },
            {
              "id": 3143,
              "code": "659003",
              "name": "图木舒克市",
              "areacode": "659000"
            },
            {
              "id": 3144,
              "code": "659004",
              "name": "五家渠市",
              "areacode": "659000"
            }
          ]
        }
      ]
    },
    {
      "id": 32,
      "code": "710000",
      "name": "台湾省",
      "city": []
    },
    {
      "id": 33,
      "code": "810000",
      "name": "香港特别行政区",
      "city": []
    },
    {
      "id": 34,
      "code": "820000",
      "name": "澳门特别行政区",
      "city": []
    }
  ],
}


export {citys} 
