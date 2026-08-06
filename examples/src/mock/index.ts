export const formTableData = [
  {
    id:1,
    name:'集团V网业务受理',
    jsonSchema:`{
      "schemas": [
        {
            "id": "root",
            "label": "表单",
            "props": {
                "colon": true,
                "labelAlign": "right",
                "labelCol": {
                    "span": 5
                },
                "labelLayout": "fixed",
                "labelPlacement": "left",
                "labelWidth": "120px",
                "layout": "horizontal",
                "name": "default",
                "wrapperCol": {
                    "span": 19
                },
                "labelSuffix": ":"
            },
            "type": "form",
            "children": [
                {
                    "label": "客户信息",
                    "props": {
                        "style": {
                            "margin": "10px"
                        },
                        "gridCols": 4,
                        "gridEnable": true
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "select_3310",
                            "input": true,
                            "label": "客户名称",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "客户1",
                                        "value": "kh001"
                                    },
                                    {
                                        "label": "客户2",
                                        "value": "kh002"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default",
                                "fitInputWidth": true
                            },
                            "type": "select",
                            "id": "select_3310",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ],
                            "on": {
                                "change": [
                                    {
                                        "componentId": null,
                                        "methodName": "test",
                                        "type": "custom"
                                    }
                                ]
                            }
                        },
                        {
                            "field": "input_2201",
                            "input": true,
                            "label": "客户编码",
                            "props": {
                                "placeholder": "请输入",
                                "readonly": true
                            },
                            "type": "input",
                            "id": "input_2201",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "field": "select_4644",
                            "input": true,
                            "label": "添加合同",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_4644",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "field": "input_1721",
                            "input": true,
                            "label": "全网商机编码",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_1721"
                        },
                        {
                            "field": "input_9236",
                            "input": true,
                            "label": "全网项目编码",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_9236"
                        }
                    ],
                    "id": "card_4296"
                },
                {
                    "label": "集团V网（全国版）",
                    "props": {
                        "gridEnable": false,
                        "style": {
                            "margin": "10px"
                        }
                    },
                    "type": "card",
                    "children": [
                        {
                            "label": "产品属性",
                            "props": {
                                "gridCols": 4,
                                "gridEnable": true,
                                "style": {
                                    "margin": "10px"
                                }
                            },
                            "type": "card",
                            "children": [
                                {
                                    "field": "input_7212",
                                    "input": true,
                                    "label": "集团客户联系人",
                                    "props": {
                                        "placeholder": "请输入"
                                    },
                                    "type": "input",
                                    "id": "input_7212",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "string"
                                        }
                                    ]
                                },
                                {
                                    "field": "input_6367",
                                    "input": true,
                                    "label": "集团客户联系电话",
                                    "props": {
                                        "placeholder": "请输入"
                                    },
                                    "type": "input",
                                    "id": "input_6367",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "string"
                                        }
                                    ]
                                },
                                {
                                    "field": "input_7144",
                                    "input": true,
                                    "label": "集团客户联系人邮箱",
                                    "props": {
                                        "placeholder": "请输入"
                                    },
                                    "type": "input",
                                    "id": "input_7144"
                                },
                                {
                                    "field": "input_5033",
                                    "input": true,
                                    "label": "集团客户简称",
                                    "props": {
                                        "placeholder": "请输入"
                                    },
                                    "type": "input",
                                    "id": "input_5033",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "string"
                                        }
                                    ]
                                },
                                {
                                    "field": "number_5311",
                                    "input": true,
                                    "label": "折扣率（0-100%）",
                                    "type": "number",
                                    "id": "number_5311",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "number"
                                        }
                                    ]
                                },
                                {
                                    "field": "select_7368",
                                    "input": true,
                                    "label": "统付类型",
                                    "props": {
                                        "effect": "light",
                                        "options": [
                                            {
                                                "label": "集团统付",
                                                "value": "集团统付"
                                            }
                                        ],
                                        "placeholder": "请选择",
                                        "placement": "bottom-start",
                                        "size": "default",
                                        "defaultValue": "集团统付"
                                    },
                                    "type": "select",
                                    "id": "select_7368",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "string"
                                        }
                                    ]
                                },
                                {
                                    "field": "number_8840",
                                    "input": true,
                                    "label": "最大成员数",
                                    "type": "number",
                                    "id": "number_8840",
                                    "rules": [
                                        {
                                            "message": "必填项",
                                            "required": true,
                                            "trigger": [
                                                "change"
                                            ],
                                            "type": "number"
                                        }
                                    ]
                                },
                                {
                                    "field": "input_1807",
                                    "input": true,
                                    "label": "备注",
                                    "props": {
                                        "placeholder": "请输入"
                                    },
                                    "type": "input",
                                    "id": "input_1807"
                                },
                                {
                                    "field": "upload-file_2371",
                                    "input": true,
                                    "label": "附件",
                                    "props": {
                                        "action": "https://examples.epicjs.cn/epic-mock/common/upload",
                                        "name": "file",
                                        "showFileList": true
                                    },
                                    "type": "upload-file",
                                    "id": "upload-file_2371"
                                }
                            ],
                            "id": "card_1731"
                        },
                        {
                            "label": "产品资费",
                            "props": {
                                "style": {
                                    "margin": "10px"
                                }
                            },
                            "type": "card",
                            "children": [],
                            "id": "card_4507"
                        }
                    ],
                    "id": "card_5415"
                },
                {
                    "label": "账务信息",
                    "props": {
                        "gridCols": 4,
                        "gridEnable": true,
                        "style": {
                            "margin": "10px"
                        }
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "select_9084",
                            "input": true,
                            "label": "账期生效规则",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_9084",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "field": "select_1170",
                            "input": true,
                            "label": "支付模式",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_1170",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "field": "select_4318",
                            "input": true,
                            "label": "支付账户",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_4318"
                        },
                        {
                            "field": "select_8180",
                            "input": true,
                            "label": "付费类型",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_8180"
                        },
                        {
                            "field": "select_9502",
                            "input": true,
                            "label": "缴费周期",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_9502"
                        },
                        {
                            "field": "input_4796",
                            "input": true,
                            "label": "缴费周期时长",
                            "props": {
                                "placeholder": "请输入",
                                "type": "number"
                            },
                            "type": "input",
                            "id": "input_4796"
                        }
                    ],
                    "id": "card_8891"
                },
                {
                    "label": "其它信息",
                    "props": {
                        "style": {
                            "margin": "10px"
                        },
                        "gridCols": 4,
                        "gridEnable": true
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "input_3353",
                            "input": true,
                            "label": "客户经理名称",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_3353",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "field": "input_3782",
                            "input": true,
                            "label": "客户经理电话",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_3782",
                            "rules": [
                                {
                                    "message": "必填项",
                                    "required": true,
                                    "trigger": [
                                        "change"
                                    ],
                                    "type": "string"
                                }
                            ]
                        }
                    ],
                    "id": "card_9457"
                },
                {
                    "label": "经办人信息",
                    "props": {
                        "style": {
                            "margin": "10px"
                        },
                        "gridCols": 4,
                        "gridEnable": true
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "input_2497",
                            "input": true,
                            "label": "经办人姓名",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_2497"
                        },
                        {
                            "field": "input_2357",
                            "input": true,
                            "label": "经办人电话",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_2357"
                        },
                        {
                            "field": "input_9790",
                            "input": true,
                            "label": "证件类型",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_9790"
                        },
                        {
                            "field": "input_5602",
                            "input": true,
                            "label": "证件编号",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_5602"
                        },
                        {
                            "field": "upload-file_3897",
                            "input": true,
                            "label": "证件附件",
                            "props": {
                                "action": "https://examples.epicjs.cn/epic-mock/common/upload",
                                "name": "file",
                                "showFileList": true
                            },
                            "type": "upload-file",
                            "id": "upload-file_3897"
                        },
                        {
                            "field": "upload-file_8462",
                            "input": true,
                            "label": "经办人照片",
                            "props": {
                                "action": "https://examples.epicjs.cn/epic-mock/common/upload",
                                "name": "file",
                                "showFileList": true
                            },
                            "type": "upload-file",
                            "id": "upload-file_8462"
                        },
                        {
                            "field": "upload-file_3659",
                            "input": true,
                            "label": "授权委托书附件",
                            "props": {
                                "action": "https://examples.epicjs.cn/epic-mock/common/upload",
                                "name": "file",
                                "showFileList": true
                            },
                            "type": "upload-file",
                            "id": "upload-file_3659"
                        }
                    ],
                    "id": "card_4516"
                },
                {
                    "label": "渠道信息",
                    "props": {
                        "style": {
                            "margin": "10px"
                        },
                        "gridCols": 4,
                        "gridEnable": true
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "select_6378",
                            "input": true,
                            "label": "一级渠道类型",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "政企渠道",
                                        "value": "政企渠道"
                                    },
                                    {
                                        "label": "BC融合渠道",
                                        "value": "BC融合渠道"
                                    },
                                    {
                                        "label": "其他渠道",
                                        "value": "其他渠道"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default",
                                "defaultValue": "政企渠道"
                            },
                            "type": "select",
                            "id": "select_6378"
                        },
                        {
                            "field": "input_3450",
                            "input": true,
                            "label": "发展渠道编码",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_3450"
                        },
                        {
                            "field": "input_1336",
                            "input": true,
                            "label": "发展渠道名称",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_1336"
                        },
                        {
                            "field": "input_9725",
                            "input": true,
                            "label": "维护渠道编码",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_9725"
                        },
                        {
                            "field": "input_9919",
                            "input": true,
                            "label": "酬金结算比例",
                            "props": {
                                "placeholder": "请输入",
                                "type": "number"
                            },
                            "type": "input",
                            "id": "input_9919"
                        }
                    ],
                    "id": "card_5166"
                },
                {
                    "label": "业务标签",
                    "props": {
                        "gridEnable": true,
                        "gridCols": 4,
                        "style": {
                            "margin": "10px"
                        }
                    },
                    "type": "card",
                    "children": [
                        {
                            "field": "select_2663",
                            "input": true,
                            "label": "业务用途",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_2663"
                        },
                        {
                            "field": "select_2395",
                            "input": true,
                            "label": "统谈统签统付业务",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "否",
                                        "value": "1"
                                    },
                                    {
                                        "label": "是",
                                        "value": "2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default",
                                "defaultValue": "1"
                            },
                            "type": "select",
                            "id": "select_2395"
                        },
                        {
                            "field": "select_3730",
                            "input": true,
                            "label": "统谈级别",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_3730"
                        },
                        {
                            "field": "input_9311",
                            "input": true,
                            "label": "统谈催缴人姓名",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_9311"
                        },
                        {
                            "field": "input_5167",
                            "input": true,
                            "label": "统谈催缴人电话",
                            "props": {
                                "placeholder": "请输入"
                            },
                            "type": "input",
                            "id": "input_5167"
                        },
                        {
                            "field": "select_6968",
                            "input": true,
                            "label": "付费主体一级标签",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_6968"
                        },
                        {
                            "field": "select_6614",
                            "input": true,
                            "label": "付费主体二级标签",
                            "props": {
                                "effect": "light",
                                "options": [
                                    {
                                        "label": "选项1",
                                        "value": "选项1"
                                    },
                                    {
                                        "label": "选项2",
                                        "value": "选项2"
                                    }
                                ],
                                "placeholder": "请选择",
                                "placement": "bottom-start",
                                "size": "default"
                            },
                            "type": "select",
                            "id": "select_6614"
                        }
                    ],
                    "id": "card_4237"
                }
            ]
        }
    ],
    "script": "const { defineExpose, find } = epic; function test (value){   const khbm = value;      find('input_2201','field').setValue(khbm)  }   defineExpose({   test  })"
    }`
  },
  {
    id:2,
    name:'接口转换-成员视频彩铃',
    "jsonSchema": String.raw`{"schemas":[{"id":"root","label":"表单","props":{"colon":true,"labelAlign":"right","labelCol":{"span":5},"labelLayout":"fixed","labelPlacement":"left","labelWidth":"120px","layout":"horizontal","name":"default","wrapperCol":{"span":19},"labelSuffix":":"},"type":"form","children":[{"label":"客户信息","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true},"children":[{"field":"select_3310","input":true,"label":"客户名称","props":{"effect":"light","options":[{"label":"客户1","value":"kh001"},{"label":"客户2","value":"kh002"}],"placeholder":"请选择","placement":"bottom-start","size":"default","fitInputWidth":true},"type":"select","id":"select_3310","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}],"on":{"change":[{"componentId":"select_3310","methodName":"test","type":"custom"},{"componentId":"select_3310","methodName":"changeCustomer","type":"custom"}]}},{"field":"input_2201","input":true,"label":"客户编码","props":{"placeholder":"请输入","readonly":true},"type":"input","id":"input_2201","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_4644","input":true,"label":"添加合同","props":{"effect":"light","options":[{"label":"选项1","value":"选项1"},{"label":"选项2","value":"选项2"}],"placeholder":"请选择","placement":"bottom-start","size":"default"},"type":"select","id":"select_4644","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1721","input":true,"label":"全网商机编码","props":{"placeholder":"请输入"},"type":"input","id":"input_1721"},{"field":"input_9236","input":true,"label":"全网项目编码","props":{"placeholder":"请输入"},"type":"input","id":"input_9236"}],"id":"card_450qsoh2"},{"label":"选择产品","type":"card","props":{"style":{"margin":"10px"}},"children":[{"field":"checkbox_7206","input":true,"label":"","props":{"options":[{"skuNum":"910401","skuName":"成员视频彩铃","skuBusinessNum":"1910401A","skuInstBusinessNum":"1910401001","label":"成员视频彩铃","value":"910401"},{"skuNum":"900015","skuName":"zyy-js-01","skuBusinessNum":"1900015","skuInstBusinessNum":"1900015001","label":"zyy-js-01","value":"900015"},{"skuNum":"20250604","skuName":"test112233","skuBusinessNum":"120250604","skuInstBusinessNum":"120250604001","label":"test112233","value":"20250604"},{"skuNum":"2025999480000188","skuName":"ai-zyy-003","skuBusinessNum":"12025999480000188","skuInstBusinessNum":"12025999480000188001","label":"ai-zyy-003","value":"2025999480000188"}]},"type":"checkbox","id":"checkbox_7206","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"array"}],"on":{"change":[{"componentId":"checkbox_7206","methodName":"changeProduct","type":"custom"}]}}],"id":"card_tynq4mjm"},{"label":"成员视频彩铃","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true,"hidden":true},"children":[{"field":"input_9104010002","input":true,"label":"企业联系人电话","props":{"placeholder":"请输入电话"},"type":"input","id":"input_9104010002","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_9104010206","input":true,"label":"企业联系人","props":{"placeholder":"请输入企业联系人"},"type":"input","id":"input_9104010206","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_9104010008","input":true,"label":"统付标识","props":{"placeholder":"请选择","effect":"light","options":[{"label":"统付","value":"01"},{"label":"个付","value":"02"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010008","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_9104010007","input":true,"label":"地市编码","props":{"placeholder":"请选择"},"type":"input","id":"input_9104010007","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_9104010204","input":true,"label":"试用期（月）","props":{"placeholder":"请选择","effect":"light","options":[{"label":"无","value":"01"},{"label":"1个月","value":"02"},{"label":"2个月","value":"03"},{"label":"3个月","value":"04"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010204","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_9104010012","input":true,"label":"成员量（人）","props":{"placeholder":"请输入上限"},"type":"input","id":"input_9104010012"},{"field":"upload-file_9104010021","input":true,"label":"低资费/试用期审批附件","props":{"placeholder":"请选择","action":"","name":"file","showFileList":true},"type":"upload-file","id":"upload-file_9104010021"},{"field":"select_9104010010","input":true,"label":"合同到期后处理方式","props":{"placeholder":"请选择","effect":"light","options":[{"label":"业务暂停","value":"1"},{"label":"业务注销","value":"2"},{"label":"业务长期有效","value":"3"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010010","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_9104010203","input":true,"label":"月套餐-成员计费方式","props":{"placeholder":"请选择","effect":"light","options":[{"label":"实际成员量","value":"01"},{"label":"固定成员量","value":"02"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010203"},{"field":"select_9104010201","input":true,"label":"月套餐-企业主代付","props":{"placeholder":"请选择","effect":"light","options":[{"label":"是","value":"01"},{"label":"否","value":"02"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010201"},{"field":"input_9104010202","input":true,"label":"企业主代付-付账手机号","props":{"placeholder":"请输入电话"},"type":"input","id":"input_9104010202"},{"field":"input_9104010001","input":true,"label":"管理员邮箱","props":{"placeholder":"请输入邮箱"},"type":"input","id":"input_9104010001"},{"field":"input_9104010009","input":true,"label":"客户经理工号","props":{"placeholder":"请输入"},"type":"input","id":"input_9104010009"},{"field":"input_9104010205","input":true,"label":"按天计费-结束时间","props":{"placeholder":"请输入结束时间"},"type":"input","id":"input_9104010205"},{"field":"input_9104010015","input":true,"label":"功能费x元／季度／成员","props":{"placeholder":"请输入期望开通计费时间"},"type":"input","id":"input_9104010015"},{"field":"input_9104010022","input":true,"label":"尊享版-合同年度金额（元）","props":{"placeholder":"请输入"},"type":"input","id":"input_9104010022"},{"field":"input_9104010016","input":true,"label":"功能费x元／半年／成员","props":{"placeholder":"请输入期望开通计费时间"},"type":"input","id":"input_9104010016"},{"field":"select_9104010025","input":true,"label":"中间号-业务类型","props":{"placeholder":"请选择","effect":"light","options":[{"label":"基础版","value":"01"},{"label":"定制版","value":"02"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010025"},{"field":"input_9104010017","input":true,"label":"功能费x元／年／成员","props":{"placeholder":"请输入期望开通计费时间"},"type":"input","id":"input_9104010017"},{"field":"select_9104010207","input":true,"label":"集团彩铃割接订购","props":{"placeholder":"请选择","effect":"light","options":[{"label":"是","value":"是"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010207"},{"field":"select_9104010020","input":true,"label":"激活首月计费方式","props":{"placeholder":"请选择","effect":"light","options":[{"label":"立即生效","value":"1"},{"label":"下账期生效","value":"2"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010020"},{"field":"select_9104010013","input":true,"label":"第二周期计费方式","props":{"placeholder":"请选择","effect":"light","options":[{"label":"（基础版）套餐包","value":"1"},{"label":"业务暂停","value":"2"},{"label":"（基础版）月套餐","value":"3"},{"label":"（尊享版）套餐包","value":"4"},{"label":"（尊享版）月套餐","value":"5"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010013"},{"field":"input_9104010018","input":true,"label":"功能费x元／月／成员","props":{"placeholder":"请输入期望开通计费时间"},"type":"input","id":"input_9104010018"},{"field":"select_9104010019","input":true,"label":"套餐包功能费","props":{"placeholder":"请输入期望开通计费时间","effect":"light","options":[{"label":"功能费x元／季度／成员","value":"9104010015"},{"label":"功能费x元／半年／成员","value":"9104010016"},{"label":"功能费x元／年／成员","value":"9104010017"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010019"},{"field":"select_9104010023","input":true,"label":"服务费结算档位","props":{"placeholder":"请选择","effect":"light","options":[{"label":"服务费结算价60元","value":"1"},{"label":"服务费结算价258元","value":"2"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010023"},{"field":"select_9104010024","input":true,"label":"资费类型","props":{"placeholder":"请选择","effect":"light","options":[{"label":"基础版套餐","value":"1"},{"label":"尊享版套餐","value":"2"},{"label":"内容版（咪咕专用）套餐","value":"3"},{"label":"音频彩铃套餐","value":"4"},{"label":"中间号套餐-按次计费","value":"5"},{"label":"中间号套餐-基础套餐","value":"6"},{"label":"中间号套餐-升级套餐","value":"7"},{"label":"中间号套餐-尊享套餐","value":"8"},{"label":"工作号套餐","value":"9"},{"label":"400热线套餐","value":"10"},{"label":"双彩融合套餐-网内版","value":"11"},{"label":"双彩融合套餐-三网基础版","value":"12"},{"label":"双彩融合套餐-三网升级版","value":"13"},{"label":"按天计费","value":"14"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_9104010024"}],"id":"skuCard_910401"},{"label":"zyy-js-01","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true,"hidden":true},"children":[{"field":"input_1011300186001","input":true,"label":"客户联系人姓名","props":{"placeholder":"请输入"},"type":"input","id":"input_1011300186001","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300186002","input":true,"label":"客户联系人电话","props":{"placeholder":"请输入11位手机号码"},"type":"input","id":"input_1011300186002","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300186003","input":true,"label":"客户联系人邮箱","props":{"placeholder":"请输入有效邮箱地址"},"type":"input","id":"input_1011300186003"}],"id":"skuCard_900015"},{"label":"test112233","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true,"hidden":true},"children":[{"field":"input_1011300196001","input":true,"label":"客户联系人姓名","props":{"placeholder":"请输入"},"type":"input","id":"input_1011300196001","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300196002","input":true,"label":"客户联系人电话","props":{"placeholder":"请输入11位手机号码"},"type":"input","id":"input_1011300196002","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300196003","input":true,"label":"客户联系人邮箱","props":{"placeholder":"请输入有效邮箱地址"},"type":"input","id":"input_1011300196003"},{"field":"select_1011300196004","input":true,"label":"234","props":{"placeholder":"11","effect":"light","options":[{"label":"11","value":"01"},{"label":"3","value":"02"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_1011300196004"}],"id":"skuCard_20250604"},{"label":"ai-zyy-003","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true,"hidden":true},"children":[{"field":"input_1011300184001","input":true,"label":"客户联系人姓名","props":{"placeholder":"请输入"},"type":"input","id":"input_1011300184001","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300184002","input":true,"label":"客户联系人电话","props":{"placeholder":"请输入11位手机号码"},"type":"input","id":"input_1011300184002","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"input_1011300184003","input":true,"label":"客户联系人邮箱","props":{"placeholder":"请输入有效邮箱地址"},"type":"input","id":"input_1011300184003"}],"id":"skuCard_2025999480000188"},{"label":"账务信息","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true},"children":[{"field":"select_8002","input":true,"label":"账期生效规则","props":{"placeholder":"请选择","effect":"light","options":[{"label":"立即生效","value":"1"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8002","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_8001","input":true,"label":"支付模式","props":{"placeholder":"请选择","effect":"light","options":[{"label":"主办省一点受理，一点支付","value":"3"},{"label":"本省受理,本省支付","value":"5"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8001","rules":[{"message":"必填项","required":true,"trigger":["change"],"type":"string"}]},{"field":"select_7001","input":true,"label":"付费类型","props":{"placeholder":"付费类型","effect":"light","options":[{"label":"预付费","value":"1"},{"label":"后付费","value":"2"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_7001"},{"field":"select_7002","input":true,"label":"缴费周期","props":{"placeholder":"缴费周期","effect":"light","options":[{"label":"按月付","value":"0"},{"label":"季付","value":"1"},{"label":"半年付","value":"2"},{"label":"年付","value":"3"},{"label":"一次性付费","value":"4"},{"label":"按验收阶段付款","value":"5"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_7002"},{"field":"input_7003","input":true,"label":"缴费周期时长","props":{"placeholder":"缴费周期时长"},"type":"input","id":"input_7003"}],"id":"card_g6828meo"},{"label":"渠道信息","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true},"children":[{"field":"select_8044","input":true,"label":"一级渠道类型","props":{"placeholder":"请选择渠道类型","effect":"light","options":[{"label":"政企渠道","value":"政企渠道"},{"label":"BC融合渠道","value":"BC融合渠道"},{"label":"其他渠道","value":"其他渠道"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8044"},{"field":"input_8028","input":true,"label":"发展渠道编码","props":{"placeholder":"输入发展渠道编码"},"type":"input","id":"input_8028"},{"field":"input_8043","input":true,"label":"发展渠道名称","props":{"placeholder":"输入发展渠道名称"},"type":"input","id":"input_8043"},{"field":"input_8029","input":true,"label":"维护渠道编码","props":{"placeholder":"输入维护渠道编码"},"type":"input","id":"input_8029"},{"field":"input_8032","input":true,"label":"酬金结算比例","props":{"placeholder":"请输入发展渠道酬金结算比例"},"type":"input","id":"input_8032"}],"id":"card_hjf9153a"},{"label":"经办人信息","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true},"children":[{"field":"input_8004","input":true,"label":"经办人姓名","props":{"placeholder":"经办人姓名"},"type":"input","id":"input_8004"},{"field":"input_8005","input":true,"label":"经办人电话","props":{"placeholder":"经办人电话"},"type":"input","id":"input_8005"},{"field":"input_8006","input":true,"label":"证件类型","props":{"placeholder":"经办人证件类型"},"type":"input","id":"input_8006"},{"field":"input_8007","input":true,"label":"证件编号","props":{"placeholder":"经办人证件编号"},"type":"input","id":"input_8007"}],"id":"card_pqugmrv5"},{"label":"业务标签","type":"card","props":{"style":{"margin":"10px"},"gridCols":4,"gridEnable":true},"children":[{"field":"select_8045","input":true,"label":"业务用途","props":{"placeholder":"请选择业务用途","effect":"light","options":[{"label":"自用业务","value":"1"},{"label":"测试业务","value":"2"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8045"},{"field":"select_8046","input":true,"label":"统谈统签统付业务","props":{"placeholder":"请选择统谈统签统付业务","effect":"light","options":[{"label":"否","value":"0"},{"label":"是","value":"1"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8046"},{"field":"select_8047","input":true,"label":"统谈级别","props":{"placeholder":"请选择统谈级别","effect":"light","options":[{"label":"全国","value":"1"},{"label":"全省","value":"2"},{"label":"地市","value":"3"},{"label":"区县","value":"4"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8047"},{"field":"input_8048","input":true,"label":"统谈催缴人姓名","props":{"placeholder":"统谈催缴人姓名"},"type":"input","id":"input_8048"},{"field":"input_8049","input":true,"label":"统谈催缴人电话","props":{"placeholder":"统谈催缴人电话"},"type":"input","id":"input_8049"},{"field":"select_8050","input":true,"label":"付费主体一级标签","props":{"placeholder":"请选择付费主体一级标签","effect":"light","options":[{"label":"政府类","value":"1"},{"label":"企业类","value":"2"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8050"},{"field":"select_8051","input":true,"label":"付费主体二级标签","props":{"placeholder":"请选择付费主体二级标签","effect":"light","options":[{"label":"省市政府机关","value":"11"},{"label":"县乡及以下级别政府机关","value":"12"},{"label":"事业单位","value":"13"},{"label":"平台公司","value":"14"},{"label":"军队","value":"15"},{"label":"央国企","value":"21"},{"label":"大型民企","value":"22"},{"label":"中型民企","value":"23"},{"label":"小微企业","value":"24"},{"label":"个体工商户","value":"25"}],"placement":"bottom-start","size":"default"},"type":"select","id":"select_8051"}],"id":"card_6czk3vhe"}]}],"script":"const { defineExpose, find } = epic; \r\n\r\n/**\r\n * 切换客户\r\n */\r\nfunction changeCustomer (value){\r\n    const khbm = value;\r\n    find('input_2201','field').setValue(khbm)\r\n}\r\n\r\n/**\r\n * 选择产品\r\n */\r\nfunction changeProduct(value){\r\n    console.log(this)\r\n    // 获取当前组件实例\r\n    const instance = find(this._componentId)\r\n    console.log('instance',instance);\r\n\r\n    // 从实例上获取选项数据\r\n    const options = instance.schema?.props.options;\r\n    console.log('options',options)\r\n    // 遍历选项数据，显示/隐藏产品属性\r\n    options.map(item=>{\r\n        // 设置隐藏或显示\r\n        find('skuCard_'+item.value).setAttr('hidden',!value.includes(item.value))\r\n    })\r\n}\r\ndefineExpose({   \r\n    changeCustomer,\r\n    changeProduct\r\n})\r\n"}`
  }
]