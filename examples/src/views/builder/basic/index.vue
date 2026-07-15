<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { ref } from 'vue';

import { EBuilder } from '@ies/core';
import { pluginManager } from '@ies/manager';

const ebRef = ref<InstanceType<typeof EBuilder>>();
const Button = pluginManager.component.get('button');

const pageSchema = ref<PageSchema>({
  canvas: {
    mode: 'desktop',
  },
  schemas: [
    {
  "id": "root",
  "label": "订购表单",
  "props": {
    "colon": true,
    "labelAlign": "right",
    "labelCol": {
      "span": 5
    },
    "labelLayout": "fixed",
    "labelWidth": "120px",
    "layout": "horizontal",
    "name": "default",
    "wrapperCol": {
      "span": 19
    },
    "labelPosition": "right",
    "labelSuffix": ":"
  },
  "type": "form",
  "children": [
    {
      "label": "订购信息",
      "type": "card",
      "props": {
        "style": {
          "margin": "10px"
        },
        "gridEnable": true,
        "gridCols": 4
      },
      "children": [
        {
          "type": "text-view",
          "field": "package.packageName",
          "label": "套餐名称",
          "input": true,
          "id": "packageName",
          "props": {
            "defaultValue": "企业学培",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "package.packageNum",
          "label": "套餐编码",
          "input": true,
          "id": "packageNum",
          "props": {
            "defaultValue": "60017001",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "package.offerName",
          "label": "商品名称",
          "input": true,
          "id": "offerName",
          "props": {
            "defaultValue": "企业学培",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "offerNum",
          "label": "商品编码",
          "input": true,
          "id": "offerNum",
          "props": {
            "defaultValue": "60017",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "package.description",
          "label": "套餐描述",
          "input": true,
          "id": "description",
          "props": {
            "defaultValue": "<p>    企业阅读，主要面向集团客户，通过咪咕阅读客户端、咪咕阅读器和咪咕中信书店客户端，提供智能阅读器、实体书、电子书的企业阅读整体学习解决方案，为员工提供高效便捷的一站式高品质阅读服务。<br><br></p> ",
            "readonly": true,
            "placeholder": "",
            "span": 4
          }
        },
        {
          "type": "text-view",
          "field": "package.packageBusinessName",
          "label": "业务名称",
          "input": true,
          "id": "packageBusinessName",
          "props": {
            "defaultValue": "新增商品订购",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "package.packageBusinessNum",
          "label": "业务编码",
          "input": true,
          "id": "packageBusinessNum",
          "props": {
            "defaultValue": "160017001",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "package.offerType",
          "label": "类型",
          "input": true,
          "id": "offerType",
          "props": {
            "defaultValue": "1",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "alias",
          "label": "别名",
          "input": true,
          "id": "alias",
          "props": {
            "defaultValue": "busiOpportunity_dictProjectId",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "operationType",
          "label": "operationType",
          "input": true,
          "id": "operationType",
          "props": {
            "defaultValue": "1",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "operation",
          "label": "operation",
          "input": true,
          "id": "operation",
          "props": {
            "defaultValue": "addOrder",
            "readonly": true,
            "placeholder": ""
          }
        },
        {
          "type": "text-view",
          "field": "orderSource",
          "label": "orderSource",
          "input": true,
          "id": "orderSource",
          "props": {
            "defaultValue": "web",
            "readonly": true,
            "placeholder": ""
          }
        }
      ],
      "id": "card_uig7m3a6"
    },
    {
      "label": "客户信息",
      "type": "card",
      "props": {
        "style": {
          "margin": "10px"
        },
        "gridCols": 4,
        "gridEnable": true
      },
      "children": [
        {
          "field": "select_3310",
          "input": true,
          "label": "客户名称",
          "props": {
            "effect": "light",
            "dataSource": {
              "type": "static",
              "config": {
                "options": [
                  {
                    "label": "客户1",
                    "value": "kh001"
                  },
                  {
                    "label": "客户2",
                    "value": "kh002"
                  }
                ]
              }
            },
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
                "componentId": "select_3310",
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
            "readonly": false
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
            "dataSource": {
              "type": "static",
              "config": {
                "options": [
                  {
                    "label": "选项1",
                    "value": "选项1"
                  },
                  {
                    "label": "选项2",
                    "value": "选项2"
                  }
                ]
              }
            },
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
      "id": "card_wfobj44b"
    },
    {
      "type": "checkbox",
      "field": "package.selectedSkuNum",
      "label": "选择商品",
      "input": true,
      "id": "selectedSkuNum",
      "props": {
        "dataSource": {
          "type": "static",
          "config": {
            "options": [
              {
                "label": "企业学培-尊享包",
                "value": "2025999480006336",
                "skuName": "企业学培-尊享包",
                "productType": "2",
                "skuInstNum": "2025999480006336001",
                "skuInstName": "企业学培-尊享包",
                "skuBusinessNum": "12025999480006336",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480006336001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培集采-尊享包",
                "value": "2025999480006500",
                "skuName": "企业学培集采-尊享包",
                "productType": "3",
                "skuInstNum": "2025999480006500001",
                "skuInstName": "企业学培集采-尊享包",
                "skuBusinessNum": "12025999480006500",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480006500001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培-豪华包",
                "value": "2025999480006501",
                "skuName": "企业学培-豪华包",
                "productType": "2",
                "skuInstNum": "2025999480006501001",
                "skuInstName": "企业学培-豪华包",
                "skuBusinessNum": "12025999480006501",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480006501001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培集采-豪华包",
                "value": "2025999480006502",
                "skuName": "企业学培集采-豪华包",
                "productType": "3",
                "skuInstNum": "2025999480006502001",
                "skuInstName": "企业学培集采-豪华包",
                "skuBusinessNum": "12025999480006502",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480006502001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培-畅享包",
                "value": "2025999480009112",
                "skuName": "企业学培-畅享包",
                "productType": "1",
                "skuInstNum": "2025999480009112001",
                "skuInstName": "企业学培-畅享包",
                "skuBusinessNum": "12025999480009112",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480009112001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培集采-畅享包",
                "value": "2025999480009113",
                "skuName": "企业学培集采-畅享包",
                "productType": "3",
                "skuInstNum": "2025999480009113001",
                "skuInstName": "企业学培集采-畅享包",
                "skuBusinessNum": "12025999480009113",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480009113001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              },
              {
                "label": "企业学培-阅读服务包",
                "value": "2025999480009114",
                "skuName": "企业学培-阅读服务包",
                "productType": "3",
                "skuInstNum": "2025999480009114001",
                "skuInstName": "企业学培-阅读服务包",
                "skuBusinessNum": "12025999480009114",
                "skuBusinessName": "业务受理",
                "skuInstBusinessNum": "12025999480009114001",
                "baseSku": null,
                "operationSubType": "1",
                "operationAction": null
              }
            ]
          }
        }
      },
      "rules": [
        {
          "required": true,
          "message": "请至少选择一个商品",
          "trigger": [
            "change"
          ],
          "type": "array"
        }
      ]
    },
    {
      "type": "section-group",
      "field": "package.prodordSkus",
      "label": "商品信息",
      "hideLabel": true,
      "input": true,
      "id": "section_prodordSkus",
      "props": {
        "title": "商品信息",
        "keyField": "skuNum",
        "selectionField": "package.selectedSkuNum",
        "bordered": true,
        "collapsible": false
      },
      "children": [
        {
          "type": "section-template",
          "label": "企业学培-尊享包",
          "props": {
            "optionKey": "2025999480006336",
            "optionData": {
              "action": "",
              "baseSku": "2025999480006336",
              "isBackTracking": 0,
              "productType": "2",
              "operationSubType": "1",
              "skuInstNum": "2025999480006336001",
              "skuInstName": "企业学培-尊享包",
              "skuBusinessNum": "12025999480006336",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480006336001"
            }
          },
          "id": "sku_tpl_2025999480006336",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480006336",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "select",
                  "label": "统付类型",
                  "input": true,
                  "id": "attr_6001702001_4eqeftsw",
                  "props": {
                    "placeholder": "请选择统付类型",
                    "effect": "light",
                    "options": [
                      {
                        "label": "统付",
                        "value": "01"
                      },
                      {
                        "label": "个付",
                        "value": "02"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"UnifiedPaymentType\",\"bizCharEnumSpecLst\":[{\"code\":\"01\",\"value\":\"统付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"02\",\"value\":\"个付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"统付类型\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001702001",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "统付类型为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001702002_3czg0tkm",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001702002",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001702003_ly5kv41l",
                  "props": {
                    "placeholder": "请填写正确的手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001702003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001702004_td0p8fn9",
                  "props": {
                    "placeholder": "请填写正确的邮箱",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001702004",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^([a-zA-Z0-9_\\.\\-])+\\@([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001702005_6dpb71ca",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 512,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001702005",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480006336_h6jzrqq4",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "集团付费:标准资费98元/月/成员、实际x元/月/成员，按成员数累计出账",
                        "value": "701287"
                      },
                      {
                        "label": "成员付费：企业学培-尊享包80元/月/成员",
                        "value": "701288"
                      },
                      {
                        "label": "成员付费：企业学培-尊享包90元/月/成员",
                        "value": "701289"
                      },
                      {
                        "label": "成员付费：企业学培-尊享包98元/月/成员",
                        "value": "701290"
                      },
                      {
                        "label": "成员付费：企业学培-尊享包100元/月/成员",
                        "value": "701291"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480006336",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070128701_mbhg8nyh",
                  "props": {
                    "charNum": "070128701",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070128801_b02eiw1z",
                  "props": {
                    "charNum": "070128801",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070128901_1z3pzbii",
                  "props": {
                    "charNum": "070128901",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入",
                    "readonly": true
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129001_2hrgcill",
                  "props": {
                    "charNum": "070129001",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入",
                    "readonly": true
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129101_c92x91uw",
                  "props": {
                    "charNum": "070129101",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入",
                    "readonly": true
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培集采-尊享包",
          "props": {
            "optionKey": "2025999480006500",
            "optionData": {
              "action": "",
              "baseSku": "2025999480006500",
              "isBackTracking": 0,
              "productType": "3",
              "operationSubType": "1",
              "skuInstNum": "2025999480006500001",
              "skuInstName": "企业学培集采-尊享包",
              "skuBusinessNum": "12025999480006500",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480006500001"
            }
          },
          "id": "sku_tpl_2025999480006500",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480006500",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001704001_e3bb592k",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704001",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001704002_3jgzwwkf",
                  "props": {
                    "placeholder": "请填写正确的手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704002",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001704003_tqd7d0sh",
                  "props": {
                    "placeholder": "请填写正确的邮箱",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001704003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^([a-zA-Z0-9_\\.\\-])+\\@([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001704004_h3tzzaw6",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001704004",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "select",
                  "label": "物流方式",
                  "input": true,
                  "id": "attr_6001704005_ssjqsa1g",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "快递",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"快递\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"物流方式\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001704005",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "收件人姓名",
                  "input": true,
                  "id": "attr_6001704006_vun2ysd8",
                  "props": {
                    "placeholder": "请输入收件人姓名",
                    "maxlength": 32,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704006",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "收件人联系号码",
                  "input": true,
                  "id": "attr_6001704007_i3amhj3t",
                  "props": {
                    "placeholder": "请输入联系人号码",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人联系号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704007",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人联系号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "收件人联系号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人省份",
                  "input": true,
                  "id": "attr_6001704008_k2e2jvky",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"PROVINCE\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人省份\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704008",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人省份为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人地市",
                  "input": true,
                  "id": "attr_6001704009_h1m38bjw",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"CITY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人地市\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704009",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人地市为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人区县",
                  "input": true,
                  "id": "attr_6001704010_68ioj6m3",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"COUNTY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人区县\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704010",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人区县为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "详细地址",
                  "input": true,
                  "id": "attr_6001704011_9dc7pdka",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"详细地址\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001704011",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "详细地址为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "订购时长(月)",
                  "input": true,
                  "id": "attr_6001704012_edxkwxap",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "1",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "readonly": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"1\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"订购时长(月)\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001704012",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480006500_konp1v3k",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "企业学培集采-尊享包：标准资费98元/月/张，实际资费x元/月/张，按n张实体卡数累计出账",
                        "value": "701292"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480006500",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "n 数量 (个)",
                  "input": true,
                  "id": "icb_070129202_mnh4te9q",
                  "props": {
                    "charNum": "070129202",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^(0|([1-9]\\d*))$",
                      "message": "n格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129201_smxjbyhw",
                  "props": {
                    "charNum": "070129201",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,6})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培-豪华包",
          "props": {
            "optionKey": "2025999480006501",
            "optionData": {
              "action": "",
              "baseSku": "2025999480006501",
              "isBackTracking": 0,
              "productType": "2",
              "operationSubType": "1",
              "skuInstNum": "2025999480006501001",
              "skuInstName": "企业学培-豪华包",
              "skuBusinessNum": "12025999480006501",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480006501001"
            }
          },
          "id": "sku_tpl_2025999480006501",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480006501",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "select",
                  "label": "统付类型",
                  "input": true,
                  "id": "attr_6001701001_225r7d9m",
                  "props": {
                    "placeholder": "请选择统付类型",
                    "effect": "light",
                    "options": [
                      {
                        "label": "统付",
                        "value": "01"
                      },
                      {
                        "label": "个付",
                        "value": "02"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"UnifiedPaymentType\",\"bizCharEnumSpecLst\":[{\"code\":\"01\",\"value\":\"统付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"02\",\"value\":\"个付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"统付类型\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001701001",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "统付类型为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001701002_ytru3zjy",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001701002",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001701003_qd0nfx1y",
                  "props": {
                    "placeholder": "请填写正确的手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001701003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001701004_8b1r0rqx",
                  "props": {
                    "placeholder": "请填写正确的邮箱",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001701004",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^([a-zA-Z0-9_\\.\\-])+\\@([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001701005_qpz7sncq",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 512,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001701005",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480006501_puawpr39",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "集团付费:标准资费48元/月/成员，实际资费x元/月/成员，按成员数累计出账",
                        "value": "701293"
                      },
                      {
                        "label": "成员付费：企业学培-豪华包40元/月/成员",
                        "value": "701294"
                      },
                      {
                        "label": "成员付费：企业学培-豪华包48元/月/成员",
                        "value": "701295"
                      },
                      {
                        "label": "成员付费：企业学培-豪华包50元/月/成员",
                        "value": "701296"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480006501",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129301_ms627gq8",
                  "props": {
                    "charNum": "070129301",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129401_koaxorte",
                  "props": {
                    "charNum": "070129401",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129501_7qsnkpum",
                  "props": {
                    "charNum": "070129501",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129601_8tapzaz3",
                  "props": {
                    "charNum": "070129601",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培集采-豪华包",
          "props": {
            "optionKey": "2025999480006502",
            "optionData": {
              "action": "",
              "baseSku": "2025999480006502",
              "isBackTracking": 0,
              "productType": "3",
              "operationSubType": "1",
              "skuInstNum": "2025999480006502001",
              "skuInstName": "企业学培集采-豪华包",
              "skuBusinessNum": "12025999480006502",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480006502001"
            }
          },
          "id": "sku_tpl_2025999480006502",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480006502",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001703001_r9x1g9kf",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703001",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001703002_e8yxy7e9",
                  "props": {
                    "placeholder": "请填写正确的手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703002",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001703003_5ml5muuf",
                  "props": {
                    "placeholder": "请填写正确的邮箱",
                    "maxlength": 255,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001703003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^([a-zA-Z0-9_\\.\\-])+\\@([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001703004_ck07us2g",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001703004",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "select",
                  "label": "物流方式",
                  "input": true,
                  "id": "attr_6001703005_pw5b1use",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "快递",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"快递\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"物流方式\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001703005",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "收件人姓名",
                  "input": true,
                  "id": "attr_6001703006_bytmxwfv",
                  "props": {
                    "placeholder": "请输入收件人姓名",
                    "maxlength": 32,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703006",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "收件人联系号码",
                  "input": true,
                  "id": "attr_6001703007_1d3f5d3g",
                  "props": {
                    "placeholder": "请输入联系人号码",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人联系号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703007",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人联系号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3|4|5|7|8|9][0-9]\\d{8}$",
                      "message": "收件人联系号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人省份",
                  "input": true,
                  "id": "attr_6001703008_p5evo8ja",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"PROVINCE\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人省份\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703008",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人省份为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人地市",
                  "input": true,
                  "id": "attr_6001703009_dniu3rn6",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"CITY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人地市\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703009",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人地市为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人区县",
                  "input": true,
                  "id": "attr_6001703010_hwkwjf3s",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"COUNTY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人区县\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703010",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人区县为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "详细地址",
                  "input": true,
                  "id": "attr_6001703011_2l5iknok",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"详细地址\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001703011",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "详细地址为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "订购时长（月）",
                  "input": true,
                  "id": "attr_6001703012_omd3vc3p",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "readonly": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"订购时长（月）\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001703012",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^[1-9]d*$",
                      "message": "订购时长（月）格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480006502_7jjkpdw3",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "集采-豪华包：标准资费48元/月/张，实际资费x元/月/张，按n张实体卡数累计出账",
                        "value": "701297"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480006502",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070129701_szg1cqhi",
                  "props": {
                    "charNum": "070129701",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,6})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "n 数量 (个)",
                  "input": true,
                  "id": "icb_070129702_pa0rtrcl",
                  "props": {
                    "charNum": "070129702",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^(0|([1-9]\\d*))$",
                      "message": "n格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培-畅享包",
          "props": {
            "optionKey": "2025999480009112",
            "optionData": {
              "action": "",
              "baseSku": "2025999480009112",
              "isBackTracking": 0,
              "productType": "1",
              "operationSubType": "1",
              "skuInstNum": "2025999480009112001",
              "skuInstName": "企业学培-畅享包",
              "skuBusinessNum": "12025999480009112",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480009112001"
            }
          },
          "id": "sku_tpl_2025999480009112",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480009112",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "select",
                  "label": "统付类型",
                  "input": true,
                  "id": "attr_6001705001_ywbm29kr",
                  "props": {
                    "placeholder": "请选择统付类型",
                    "effect": "light",
                    "options": [
                      {
                        "label": "统付",
                        "value": "01"
                      },
                      {
                        "label": "个付",
                        "value": "02"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"UnifiedPaymentType\",\"bizCharEnumSpecLst\":[{\"code\":\"01\",\"value\":\"统付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"02\",\"value\":\"个付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"统付类型\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001705001",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "统付类型为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001705002_erbpfbbd",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001705002",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001705003_nm5no1ut",
                  "props": {
                    "placeholder": "请输入11位手机号码",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001705003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3456789]\\d{9}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001705004_3xk83oi9",
                  "props": {
                    "placeholder": "请输入有效邮箱地址",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001705004",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001705005_dtm3xv1e",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 512,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001705005",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "select",
                  "label": "测试期套餐有效期",
                  "input": true,
                  "id": "attr_6001705006_rxcgg178",
                  "props": {
                    "placeholder": "请选择有效期",
                    "effect": "light",
                    "options": [
                      {
                        "label": "1个月",
                        "value": "01"
                      },
                      {
                        "label": "2个月",
                        "value": "02"
                      },
                      {
                        "label": "3个月",
                        "value": "03"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"01\",\"value\":\"1个月\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"02\",\"value\":\"2个月\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"03\",\"value\":\"3个月\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"测试期套餐有效期\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001705006",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480009112_oyrqfa24",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "集团付费：标准资费10元/月/成员，实际资费x元/月/成员，按成员数累计出账",
                        "value": "701464"
                      },
                      {
                        "label": "标准资费10元/月/成员，按成员出账",
                        "value": "701465"
                      },
                      {
                        "label": "免费试用期资费，需与10元畅销月包一起订购，到期后自动转正式资费",
                        "value": "701466"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480009112",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070146401_iudefakr",
                  "props": {
                    "charNum": "070146401",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070146501_l786a9jf",
                  "props": {
                    "charNum": "070146501",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070146601_fxlzjeup",
                  "props": {
                    "charNum": "070146601",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入",
                    "readonly": true,
                    "defaultValue": "0"
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培集采-畅享包",
          "props": {
            "optionKey": "2025999480009113",
            "optionData": {
              "action": "",
              "baseSku": "2025999480009113",
              "isBackTracking": 0,
              "productType": "3",
              "operationSubType": "1",
              "skuInstNum": "2025999480009113001",
              "skuInstName": "企业学培集采-畅享包",
              "skuBusinessNum": "12025999480009113",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480009113001"
            }
          },
          "id": "sku_tpl_2025999480009113",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480009113",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001706001_m4t8kb20",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706001",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001706003_apr4siof",
                  "props": {
                    "placeholder": "请输入有效邮箱地址",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001706003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001706004_9bh71k28",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 512,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001706004",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "select",
                  "label": "物流方式",
                  "input": true,
                  "id": "attr_6001706005_6avmlaru",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "快递",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"快递\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"物流方式\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001706005",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "收件人姓名",
                  "input": true,
                  "id": "attr_6001706006_kr7qtz1l",
                  "props": {
                    "placeholder": "请输入收件人姓名",
                    "maxlength": 32,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706006",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人省份",
                  "input": true,
                  "id": "attr_6001706008_lf9wxjaj",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "政企",
                        "value": "000"
                      },
                      {
                        "label": "四川",
                        "value": "280"
                      },
                      {
                        "label": "陕西",
                        "value": "290"
                      },
                      {
                        "label": "河北",
                        "value": "311"
                      },
                      {
                        "label": "山西",
                        "value": "351"
                      },
                      {
                        "label": "河南",
                        "value": "371"
                      },
                      {
                        "label": "吉林",
                        "value": "431"
                      },
                      {
                        "label": "黑龙江",
                        "value": "451"
                      },
                      {
                        "label": "内蒙古",
                        "value": "471"
                      },
                      {
                        "label": "山东",
                        "value": "531"
                      },
                      {
                        "label": "安徽",
                        "value": "551"
                      },
                      {
                        "label": "北京",
                        "value": "100"
                      },
                      {
                        "label": "浙江",
                        "value": "571"
                      },
                      {
                        "label": "福建",
                        "value": "591"
                      },
                      {
                        "label": "湖南",
                        "value": "731"
                      },
                      {
                        "label": "广西",
                        "value": "771"
                      },
                      {
                        "label": "江西",
                        "value": "791"
                      },
                      {
                        "label": "贵州",
                        "value": "851"
                      },
                      {
                        "label": "云南",
                        "value": "871"
                      },
                      {
                        "label": "西藏",
                        "value": "891"
                      },
                      {
                        "label": "海南",
                        "value": "898"
                      },
                      {
                        "label": "甘肃",
                        "value": "931"
                      },
                      {
                        "label": "广东",
                        "value": "200"
                      },
                      {
                        "label": "宁夏",
                        "value": "951"
                      },
                      {
                        "label": "青海",
                        "value": "971"
                      },
                      {
                        "label": "新疆",
                        "value": "991"
                      },
                      {
                        "label": "上海",
                        "value": "210"
                      },
                      {
                        "label": "天津",
                        "value": "220"
                      },
                      {
                        "label": "重庆",
                        "value": "230"
                      },
                      {
                        "label": "辽宁",
                        "value": "240"
                      },
                      {
                        "label": "江苏",
                        "value": "250"
                      },
                      {
                        "label": "湖北",
                        "value": "270"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"PROVINCE\",\"bizCharEnumSpecLst\":[{\"code\":\"000\",\"value\":\"政企\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"280\",\"value\":\"四川\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"290\",\"value\":\"陕西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"311\",\"value\":\"河北\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"351\",\"value\":\"山西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"371\",\"value\":\"河南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"431\",\"value\":\"吉林\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"451\",\"value\":\"黑龙江\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"471\",\"value\":\"内蒙古\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"531\",\"value\":\"山东\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"551\",\"value\":\"安徽\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"100\",\"value\":\"北京\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"571\",\"value\":\"浙江\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"591\",\"value\":\"福建\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"731\",\"value\":\"湖南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"771\",\"value\":\"广西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"791\",\"value\":\"江西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"851\",\"value\":\"贵州\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"871\",\"value\":\"云南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"891\",\"value\":\"西藏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"898\",\"value\":\"海南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"931\",\"value\":\"甘肃\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"200\",\"value\":\"广东\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"951\",\"value\":\"宁夏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"971\",\"value\":\"青海\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"991\",\"value\":\"新疆\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"210\",\"value\":\"上海\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"220\",\"value\":\"天津\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"230\",\"value\":\"重庆\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"240\",\"value\":\"辽宁\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"250\",\"value\":\"江苏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"270\",\"value\":\"湖北\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"收件人省份\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706008",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人省份为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人地市",
                  "input": true,
                  "id": "attr_6001706009_za329zyu",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"CITY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人地市\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706009",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人地市为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人区县",
                  "input": true,
                  "id": "attr_6001706010_1jzsazxt",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"COUNTY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人区县\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706010",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人区县为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "详细地址",
                  "input": true,
                  "id": "attr_6001706011_decmdsua",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"详细地址\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706011",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "详细地址为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "订购时长(月)",
                  "input": true,
                  "id": "attr_6001706012_enmm1fco",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "1",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"1\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"订购时长(月)\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001706012",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001706015_2lgi6vkw",
                  "props": {
                    "placeholder": "请输入手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706015",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3456789]\\d{9}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "收件人联系号码",
                  "input": true,
                  "id": "attr_6001706016_pvfrvbhm",
                  "props": {
                    "placeholder": "请输入联系人号码",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人联系号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001706016",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人联系号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3456789]\\d{9}$",
                      "message": "收件人联系号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480009113_2wjjq5qs",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "集采-畅享包：标准资费10元/月/份，实际资费x元/月/份，按订购数量累计出账",
                        "value": "701467"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480009113",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070146701_i5uodq25",
                  "props": {
                    "charNum": "070146701",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,6})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "n 数量 (个)",
                  "input": true,
                  "id": "icb_070146702_572ppj7i",
                  "props": {
                    "charNum": "070146702",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^(0|([1-9]\\d*))$",
                      "message": "n格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "section-template",
          "label": "企业学培-阅读服务包",
          "props": {
            "optionKey": "2025999480009114",
            "optionData": {
              "action": "",
              "baseSku": "2025999480009114",
              "isBackTracking": 0,
              "productType": "3",
              "operationSubType": "1",
              "skuInstNum": "2025999480009114001",
              "skuInstName": "企业学培-阅读服务包",
              "skuBusinessNum": "12025999480009114",
              "skuBusinessName": "业务受理",
              "skuInstBusinessNum": "12025999480009114001"
            }
          },
          "id": "sku_tpl_2025999480009114",
          "children": [
            {
              "type": "card",
              "label": "附加信息",
              "props": {
                "gridEnable": true,
                "gridCols": 4
              },
              "id": "card_extra",
              "children": [
                {
                  "type": "text-view",
                  "field": "action",
                  "label": "action",
                  "input": true,
                  "id": "extra_action",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "baseSku",
                  "label": "baseSku",
                  "input": true,
                  "id": "extra_baseSku",
                  "props": {
                    "placeholder": "",
                    "defaultValue": null
                  }
                },
                {
                  "type": "text-view",
                  "field": "isBackTracking",
                  "label": "isBackTracking",
                  "input": true,
                  "id": "extra_isBackTracking",
                  "props": {
                    "placeholder": "",
                    "defaultValue": 0
                  }
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordCharacters",
              "label": "产品属性",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordCharacters_2025999480009114",
              "props": {
                "title": "产品属性",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "企业管理员姓名",
                  "input": true,
                  "id": "attr_6001707001_yqwhctzm",
                  "props": {
                    "placeholder": "请输入姓名",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707001",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员邮箱",
                  "input": true,
                  "id": "attr_6001707003_ok25oyop",
                  "props": {
                    "placeholder": "请输入有效邮箱地址",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员邮箱\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001707003",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                      "message": "企业管理员邮箱格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "textarea",
                  "label": "业务需求描述",
                  "input": true,
                  "id": "attr_6001707004_ikmi409m",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 512,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"3\",\"charName\":\"业务需求描述\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001707004",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "select",
                  "label": "物流方式",
                  "input": true,
                  "id": "attr_6001707005_sx6vjm5h",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "快递",
                        "value": "1"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"快递\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"物流方式\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001707005",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "收件人姓名",
                  "input": true,
                  "id": "attr_6001707006_6ars08q4",
                  "props": {
                    "placeholder": "请输入收件人姓名",
                    "maxlength": 32,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人姓名\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707006",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人姓名为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人省份",
                  "input": true,
                  "id": "attr_6001707008_g9gwesmg",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [
                      {
                        "label": "政企",
                        "value": "000"
                      },
                      {
                        "label": "四川",
                        "value": "280"
                      },
                      {
                        "label": "陕西",
                        "value": "290"
                      },
                      {
                        "label": "河北",
                        "value": "311"
                      },
                      {
                        "label": "山西",
                        "value": "351"
                      },
                      {
                        "label": "河南",
                        "value": "371"
                      },
                      {
                        "label": "吉林",
                        "value": "431"
                      },
                      {
                        "label": "黑龙江",
                        "value": "451"
                      },
                      {
                        "label": "内蒙古",
                        "value": "471"
                      },
                      {
                        "label": "山东",
                        "value": "531"
                      },
                      {
                        "label": "安徽",
                        "value": "551"
                      },
                      {
                        "label": "北京",
                        "value": "100"
                      },
                      {
                        "label": "浙江",
                        "value": "571"
                      },
                      {
                        "label": "福建",
                        "value": "591"
                      },
                      {
                        "label": "湖南",
                        "value": "731"
                      },
                      {
                        "label": "广西",
                        "value": "771"
                      },
                      {
                        "label": "江西",
                        "value": "791"
                      },
                      {
                        "label": "贵州",
                        "value": "851"
                      },
                      {
                        "label": "云南",
                        "value": "871"
                      },
                      {
                        "label": "西藏",
                        "value": "891"
                      },
                      {
                        "label": "海南",
                        "value": "898"
                      },
                      {
                        "label": "甘肃",
                        "value": "931"
                      },
                      {
                        "label": "广东",
                        "value": "200"
                      },
                      {
                        "label": "宁夏",
                        "value": "951"
                      },
                      {
                        "label": "青海",
                        "value": "971"
                      },
                      {
                        "label": "新疆",
                        "value": "991"
                      },
                      {
                        "label": "上海",
                        "value": "210"
                      },
                      {
                        "label": "天津",
                        "value": "220"
                      },
                      {
                        "label": "重庆",
                        "value": "230"
                      },
                      {
                        "label": "辽宁",
                        "value": "240"
                      },
                      {
                        "label": "江苏",
                        "value": "250"
                      },
                      {
                        "label": "湖北",
                        "value": "270"
                      }
                    ],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"PROVINCE\",\"bizCharEnumSpecLst\":[{\"code\":\"000\",\"value\":\"政企\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"280\",\"value\":\"四川\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"290\",\"value\":\"陕西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"311\",\"value\":\"河北\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"351\",\"value\":\"山西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"371\",\"value\":\"河南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"431\",\"value\":\"吉林\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"451\",\"value\":\"黑龙江\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"471\",\"value\":\"内蒙古\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"531\",\"value\":\"山东\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"551\",\"value\":\"安徽\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"100\",\"value\":\"北京\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"571\",\"value\":\"浙江\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"591\",\"value\":\"福建\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"731\",\"value\":\"湖南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"771\",\"value\":\"广西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"791\",\"value\":\"江西\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"851\",\"value\":\"贵州\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"871\",\"value\":\"云南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"891\",\"value\":\"西藏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"898\",\"value\":\"海南\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"931\",\"value\":\"甘肃\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"200\",\"value\":\"广东\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"951\",\"value\":\"宁夏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"971\",\"value\":\"青海\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"991\",\"value\":\"新疆\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"210\",\"value\":\"上海\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"220\",\"value\":\"天津\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"230\",\"value\":\"重庆\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"240\",\"value\":\"辽宁\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"250\",\"value\":\"江苏\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"270\",\"value\":\"湖北\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"收件人省份\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707008",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人省份为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人地市",
                  "input": true,
                  "id": "attr_6001707009_6bpb0ler",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"CITY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人地市\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707009",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人地市为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "select",
                  "label": "收件人区县",
                  "input": true,
                  "id": "attr_6001707010_ddynsx3g",
                  "props": {
                    "placeholder": "请选择",
                    "effect": "light",
                    "options": [],
                    "placement": "bottom-start",
                    "size": "default",
                    "fitInputWidth": true,
                    "metaOverrides": "{\"alias\":\"COUNTY\",\"bizCharEnumSpecLst\":null,\"charType\":\"1\",\"charName\":\"收件人区县\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707010",
                    "syncFields": [
                      "charValue",
                      "charDisplay"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人区县为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "详细地址",
                  "input": true,
                  "id": "attr_6001707011_ni3gmbma",
                  "props": {
                    "placeholder": "请输入",
                    "maxlength": 1024,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"详细地址\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707011",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "详细地址为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "date",
                  "label": "订购生效时间",
                  "input": true,
                  "id": "attr_6001707012_rtgocu5c",
                  "props": {
                    "placeholder": "请选择",
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"8\",\"charName\":\"订购生效时间\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001707012",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "date",
                  "label": "订购失效时间",
                  "input": true,
                  "id": "attr_6001707013_4gtkgt8v",
                  "props": {
                    "placeholder": "请选择",
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"8\",\"charName\":\"订购失效时间\",\"groupNum\":null,\"optionalFlag\":1,\"showLine\":\"0\"}",
                    "charNum": "6001707013",
                    "syncFields": [
                      "charValue"
                    ]
                  }
                },
                {
                  "type": "input",
                  "label": "收件人联系号码",
                  "input": true,
                  "id": "attr_6001707014_egbt61jj",
                  "props": {
                    "placeholder": "请输入联系人号码",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"收件人联系号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707014",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "收件人联系号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3456789]\\d{9}$",
                      "message": "收件人联系号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                },
                {
                  "type": "input",
                  "label": "企业管理员手机号码",
                  "input": true,
                  "id": "attr_6001707015_vwr6otm1",
                  "props": {
                    "placeholder": "请输入手机号",
                    "maxlength": 11,
                    "showWordLimit": true,
                    "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"企业管理员手机号码\",\"groupNum\":null,\"optionalFlag\":0,\"showLine\":\"0\"}",
                    "charNum": "6001707015",
                    "syncFields": [
                      "charValue"
                    ]
                  },
                  "rules": [
                    {
                      "required": true,
                      "message": "企业管理员手机号码为必填项",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    },
                    {
                      "pattern": "^1[3456789]\\d{9}$",
                      "message": "企业管理员手机号码格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "checkbox",
              "field": "selectedTemplateNums",
              "label": "产品资费",
              "input": true,
              "id": "checkbox_tpl_2025999480009114_jzxgiwae",
              "props": {
                "dataSource": {
                  "type": "static",
                  "config": {
                    "options": [
                      {
                        "label": "一次性付费，根据客户需求计费",
                        "value": "701468"
                      }
                    ]
                  }
                }
              },
              "rules": [
                {
                  "required": true,
                  "message": "请至少选择一个产品资费",
                  "trigger": [
                    "change"
                  ],
                  "type": "array"
                }
              ]
            },
            {
              "type": "attribute-group",
              "field": "prodordTemplate",
              "label": "资费参数",
              "hideLabel": true,
              "input": true,
              "id": "attrgroup_sku_prodordTemplate_2025999480009114",
              "props": {
                "title": "资费参数",
                "bordered": true,
                "collapsible": false,
                "gridEnable": true,
                "gridCols": 2
              },
              "children": [
                {
                  "type": "input",
                  "label": "x 目录价 (元)",
                  "input": true,
                  "id": "icb_070146801_drpu5d7m",
                  "props": {
                    "charNum": "070146801",
                    "syncFields": [
                      "charValue"
                    ],
                    "placeholder": "请输入"
                  },
                  "rules": [
                    {
                      "pattern": "^([1-9]\\d*|0.\\d{1,2})(\\.\\d{1,2})?$",
                      "message": "x格式不正确",
                      "trigger": [
                        "change",
                        "blur"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "attribute-group",
      "field": "package.poordExtendCharacters",
      "label": "账务信息",
      "hideLabel": true,
      "input": true,
      "id": "attrgroup_poordExtendCharacters",
      "props": {
        "title": "账务信息",
        "bordered": true,
        "collapsible": false,
        "gridEnable": true,
        "gridCols": 4
      },
      "children": [
        {
          "type": "select",
          "label": "账期生效规则",
          "input": true,
          "id": "attr_8002_1yyzlkq5",
          "props": {
            "placeholder": "请选择",
            "effect": "light",
            "options": [
              {
                "label": "立即生效",
                "value": "1"
              },
              {
                "label": "下账期生效",
                "value": "2"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"立即生效\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"下账期生效\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"账期生效规则\",\"displayType\":0,\"groupNum\":null,\"optionalFlag\":0,\"showLine\":null}",
            "charNum": "8002",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "valueJPath": "/validateModeName$$/validateModeNum",
            "valueJPathNameField": "validateModeName",
            "valueJPathNumField": "validateModeNum"
          },
          "rules": [
            {
              "required": true,
              "message": "账期生效规则为必填项",
              "trigger": [
                "change",
                "blur"
              ]
            }
          ]
        },
        {
          "type": "select",
          "label": "支付模式",
          "input": true,
          "id": "attr_8001_u3cgi3yt",
          "props": {
            "placeholder": "请选择",
            "effect": "light",
            "options": [
              {
                "label": "主办省一点受理，一点支付",
                "value": "3"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"3\",\"value\":\"主办省一点受理，一点支付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"支付模式\",\"displayType\":0,\"groupNum\":null,\"optionalFlag\":0,\"showLine\":null}",
            "charNum": "8001",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "valueJPath": "/orderModeName$$/orderModeNum",
            "valueJPathNameField": "orderModeName",
            "valueJPathNumField": "orderModeNum"
          },
          "rules": [
            {
              "required": true,
              "message": "支付模式为必填项",
              "trigger": [
                "change",
                "blur"
              ]
            }
          ]
        },
        {
          "type": "select",
          "label": "付费类型",
          "input": true,
          "id": "attr_7001_go7w9rk4",
          "props": {
            "placeholder": "付费类型",
            "effect": "light",
            "options": [
              {
                "label": "预付费",
                "value": "1"
              },
              {
                "label": "后付费",
                "value": "2"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"paymentType\",\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"预付费\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"后付费\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"付费类型\",\"displayType\":null,\"groupNum\":\"payment\",\"optionalFlag\":1,\"showLine\":null}",
            "charNum": "7001",
            "syncFields": [
              "charValue",
              "charDisplay"
            ]
          }
        },
        {
          "type": "select",
          "label": "缴费周期",
          "input": true,
          "id": "attr_7002_k9tu0vgs",
          "props": {
            "placeholder": "缴费周期",
            "effect": "light",
            "options": [
              {
                "label": "按月付",
                "value": "0"
              },
              {
                "label": "季付",
                "value": "1"
              },
              {
                "label": "半年付",
                "value": "2"
              },
              {
                "label": "年付",
                "value": "3"
              },
              {
                "label": "一次性付费",
                "value": "4"
              },
              {
                "label": "按验收阶段付款",
                "value": "5"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"paymentCycle\",\"bizCharEnumSpecLst\":[{\"code\":\"0\",\"value\":\"按月付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"1\",\"value\":\"季付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"半年付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"3\",\"value\":\"年付\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"4\",\"value\":\"一次性付费\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"5\",\"value\":\"按验收阶段付款\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"缴费周期\",\"displayType\":null,\"groupNum\":\"payment\",\"optionalFlag\":1,\"showLine\":null}",
            "charNum": "7002",
            "syncFields": [
              "charValue",
              "charDisplay"
            ]
          }
        },
        {
          "type": "input",
          "label": "缴费周期时长",
          "input": true,
          "id": "attr_7003_bx1dheqx",
          "props": {
            "placeholder": "缴费周期时长",
            "maxlength": 4,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":\"paymentCycleMonth\",\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"缴费周期时长\",\"displayType\":null,\"groupNum\":\"payment\",\"optionalFlag\":1,\"showLine\":null}",
            "charNum": "7003",
            "syncFields": [
              "charValue"
            ]
          },
          "rules": [
            {
              "pattern": "^[0-9]{1,4}$",
              "message": "缴费周期时长格式不正确",
              "trigger": [
                "change",
                "blur"
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "attribute-group",
      "field": "package.poordCharacters",
      "label": "业务属性",
      "hideLabel": true,
      "input": true,
      "id": "attrgroup_poordCharacters",
      "props": {
        "title": "业务属性",
        "bordered": true,
        "collapsible": false,
        "gridEnable": true,
        "gridCols": 4
      },
      "children": [
        {
          "type": "select",
          "label": "一级渠道类型",
          "input": true,
          "id": "attr_8044_taf8olvq",
          "props": {
            "placeholder": "请选择渠道类型",
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
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"政企渠道\",\"value\":\"政企渠道\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"BC融合渠道\",\"value\":\"BC融合渠道\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"其他渠道\",\"value\":\"其他渠道\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"一级渠道类型\",\"displayType\":0,\"groupNum\":\"channel\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8044",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "渠道信息"
          }
        },
        {
          "type": "input",
          "label": "发展渠道编码",
          "input": true,
          "id": "attr_8028_phe8289d",
          "props": {
            "placeholder": "输入发展渠道编码",
            "maxlength": 32,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"22\",\"charName\":\"发展渠道编码\",\"displayType\":0,\"groupNum\":\"channel\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8028",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "渠道信息"
          }
        },
        {
          "type": "input",
          "label": "发展渠道名称",
          "input": true,
          "id": "attr_8043_szhjoi0u",
          "props": {
            "placeholder": "输入发展渠道名称",
            "maxlength": 512,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"发展渠道名称\",\"displayType\":0,\"groupNum\":\"channel\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8043",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "渠道信息"
          }
        },
        {
          "type": "input",
          "label": "维护渠道编码",
          "input": true,
          "id": "attr_8029_tnkdul8q",
          "props": {
            "placeholder": "输入维护渠道编码",
            "maxlength": 32,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"22\",\"charName\":\"维护渠道编码\",\"displayType\":0,\"groupNum\":\"channel\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8029",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "渠道信息"
          }
        },
        {
          "type": "input",
          "label": "酬金结算比例",
          "input": true,
          "id": "attr_8032_v5hm22cz",
          "props": {
            "placeholder": "请输入发展渠道酬金结算比例",
            "maxlength": 32,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"酬金结算比例\",\"displayType\":0,\"groupNum\":\"channel\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8032",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "渠道信息"
          },
          "rules": [
            {
              "pattern": "^(((\\d|[1-9]\\d)(\\.\\d{1,2})?)|100|100.0|100.00)$",
              "message": "酬金结算比例格式不正确",
              "trigger": [
                "change",
                "blur"
              ]
            }
          ]
        },
        {
          "type": "select",
          "label": "业务用途",
          "input": true,
          "id": "attr_8045_u8ct0jtg",
          "props": {
            "placeholder": "请选择业务用途",
            "effect": "light",
            "options": [
              {
                "label": "自用业务",
                "value": "1"
              },
              {
                "label": "测试业务",
                "value": "2"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"自用业务\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"测试业务\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"业务用途\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8045",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "select",
          "label": "统谈统签统付业务",
          "input": true,
          "id": "attr_8046_t2d7mc7z",
          "props": {
            "placeholder": "请选择统谈统签统付业务",
            "effect": "light",
            "options": [
              {
                "label": "否",
                "value": "0"
              },
              {
                "label": "是",
                "value": "1"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"askForPayType\",\"bizCharEnumSpecLst\":[{\"code\":\"0\",\"value\":\"否\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"1\",\"value\":\"是\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"统谈统签统付业务\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8046",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "select",
          "label": "统谈级别",
          "input": true,
          "id": "attr_8047_ig60c9gm",
          "props": {
            "placeholder": "请选择统谈级别",
            "effect": "light",
            "options": [
              {
                "label": "全国",
                "value": "1"
              },
              {
                "label": "全省",
                "value": "2"
              },
              {
                "label": "地市",
                "value": "3"
              },
              {
                "label": "区县",
                "value": "4"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"askForPaylevel\",\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"全国\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"全省\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"3\",\"value\":\"地市\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"4\",\"value\":\"区县\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"统谈级别\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8047",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "input",
          "label": "统谈催缴人姓名",
          "input": true,
          "id": "attr_8048_hyyqxxkg",
          "props": {
            "placeholder": "统谈催缴人姓名",
            "maxlength": 64,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":\"askForPayName\",\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"统谈催缴人姓名\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8048",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "input",
          "label": "统谈催缴人电话",
          "input": true,
          "id": "attr_8049_qrsh1rqo",
          "props": {
            "placeholder": "统谈催缴人电话",
            "maxlength": 64,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":\"askForPayPhone\",\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"统谈催缴人电话\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8049",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "select",
          "label": "付费主体一级标签",
          "input": true,
          "id": "attr_8050_3sffn8jr",
          "props": {
            "placeholder": "请选择付费主体一级标签",
            "effect": "light",
            "options": [
              {
                "label": "政府类",
                "value": "1"
              },
              {
                "label": "企业类",
                "value": "2"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"payAccountFL\",\"bizCharEnumSpecLst\":[{\"code\":\"1\",\"value\":\"政府类\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"2\",\"value\":\"企业类\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"付费主体一级标签\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8050",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "select",
          "label": "付费主体二级标签",
          "input": true,
          "id": "attr_8051_29zgkwe4",
          "props": {
            "placeholder": "请选择付费主体二级标签",
            "effect": "light",
            "options": [
              {
                "label": "省市政府机关",
                "value": "11"
              },
              {
                "label": "县乡及以下级别政府机关",
                "value": "12"
              },
              {
                "label": "事业单位",
                "value": "13"
              },
              {
                "label": "平台公司",
                "value": "14"
              },
              {
                "label": "军队",
                "value": "15"
              },
              {
                "label": "央国企",
                "value": "21"
              },
              {
                "label": "大型民企",
                "value": "22"
              },
              {
                "label": "中型民企",
                "value": "23"
              },
              {
                "label": "小微企业",
                "value": "24"
              },
              {
                "label": "个体工商户",
                "value": "25"
              }
            ],
            "placement": "bottom-start",
            "size": "default",
            "fitInputWidth": true,
            "metaOverrides": "{\"alias\":\"payAccountSL\",\"bizCharEnumSpecLst\":[{\"code\":\"11\",\"value\":\"省市政府机关\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"12\",\"value\":\"县乡及以下级别政府机关\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"13\",\"value\":\"事业单位\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"14\",\"value\":\"平台公司\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"15\",\"value\":\"军队\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"21\",\"value\":\"央国企\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"22\",\"value\":\"大型民企\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"23\",\"value\":\"中型民企\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"24\",\"value\":\"小微企业\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null},{\"code\":\"25\",\"value\":\"个体工商户\",\"parentCode\":null,\"status\":null,\"enumCode\":null,\"enumValue\":null,\"sign\":null,\"parentParam\":null}],\"charType\":\"1\",\"charName\":\"付费主体二级标签\",\"displayType\":0,\"groupNum\":\"businessTag\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "8051",
            "syncFields": [
              "charValue",
              "charDisplay"
            ],
            "groupLabel": "业务标签"
          }
        },
        {
          "type": "input",
          "label": "CT项目甩单流水号",
          "input": true,
          "id": "attr_7835_yxb8ng6r",
          "props": {
            "placeholder": "CT项目甩单流水号",
            "maxlength": 20,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"CT项目甩单流水号\",\"displayType\":0,\"groupNum\":\"pkgSeq\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "7835",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "甩单信息"
          }
        },
        {
          "type": "input",
          "label": "CT甩单合同编码",
          "input": true,
          "id": "attr_7836_0p0kjed9",
          "props": {
            "placeholder": "CT甩单合同编码",
            "maxlength": 300,
            "showWordLimit": true,
            "metaOverrides": "{\"alias\":null,\"bizCharEnumSpecLst\":null,\"charType\":\"2\",\"charName\":\"CT甩单合同编码\",\"displayType\":0,\"groupNum\":\"contractCode\",\"optionalFlag\":1,\"showLine\":\"0\"}",
            "charNum": "7836",
            "syncFields": [
              "charValue"
            ],
            "groupLabel": "合同信息"
          }
        }
      ]
    }
  ]
}
  ],
  script:
    "const { defineExpose, find } = epic;\n\nfunction test (){\n    console.log('test')\n}\n\n// 通过defineExpose暴露的函数或者属性\ndefineExpose({\n test\n})",
});

const onValidate = () => {
  ebRef.value?.validate();
};

const onReset = () => {
  ebRef.value?.resetData();
};

const onSetValue =() =>{
  const value= {
  "package": {
    "packageName": "企业学培",
    "packageNum": "60017001",
    "offerName": "企业学培",
    "description": "<p>    企业阅读，主要面向集团客户，通过咪咕阅读客户端、咪咕阅读器和咪咕中信书店客户端，提供智能阅读器、实体书、电子书的企业阅读整体学习解决方案，为员工提供高效便捷的一站式高品质阅读服务。<br><br></p> ",
    "packageBusinessName": "新增商品订购",
    "packageBusinessNum": "160017001",
    "offerType": "1",
    "validateModeName": "立即生效",
    "validateModeNum": "1",
    "orderModeName": "主办省一点受理，一点支付",
    "orderModeNum": "3",
    "poordExtendCharacters": [
      {
        "charNum": "8002",
        "charValue": "1",
        "charDisplay": "立即生效",
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": [
          {
            "code": "1",
            "value": "立即生效",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "下账期生效",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "账期生效规则",
        "displayType": 0,
        "groupNum": null,
        "optionalFlag": 0,
        "showLine": null
      },
      {
        "charNum": "8001",
        "charValue": "3",
        "charDisplay": "主办省一点受理，一点支付",
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": [
          {
            "code": "3",
            "value": "主办省一点受理，一点支付",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "支付模式",
        "displayType": 0,
        "groupNum": null,
        "optionalFlag": 0,
        "showLine": null
      },
      {
        "charNum": "7001",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "paymentType",
        "bizCharEnumSpecLst": [
          {
            "code": "1",
            "value": "预付费",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "后付费",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "付费类型",
        "displayType": null,
        "groupNum": "payment",
        "optionalFlag": 1,
        "showLine": null
      },
      {
        "charNum": "7002",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "paymentCycle",
        "bizCharEnumSpecLst": [
          {
            "code": "0",
            "value": "按月付",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "1",
            "value": "季付",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "半年付",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "3",
            "value": "年付",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "4",
            "value": "一次性付费",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "5",
            "value": "按验收阶段付款",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "缴费周期",
        "displayType": null,
        "groupNum": "payment",
        "optionalFlag": 1,
        "showLine": null
      },
      {
        "charNum": "7003",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "paymentCycleMonth",
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "缴费周期时长",
        "displayType": null,
        "groupNum": "payment",
        "optionalFlag": 1,
        "showLine": null
      }
    ],
    "poordCharacters": [
      {
        "charNum": "8044",
        "charValue": "政企渠道",
        "charDisplay": "政企渠道",
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": [
          {
            "code": "政企渠道",
            "value": "政企渠道",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "BC融合渠道",
            "value": "BC融合渠道",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "其他渠道",
            "value": "其他渠道",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "一级渠道类型",
        "displayType": 0,
        "groupNum": "channel",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8028",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "22",
        "charName": "发展渠道编码",
        "displayType": 0,
        "groupNum": "channel",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8043",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "发展渠道名称",
        "displayType": 0,
        "groupNum": "channel",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8029",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "22",
        "charName": "维护渠道编码",
        "displayType": 0,
        "groupNum": "channel",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8032",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "酬金结算比例",
        "displayType": 0,
        "groupNum": "channel",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8045",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": [
          {
            "code": "1",
            "value": "自用业务",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "测试业务",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "业务用途",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8046",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "askForPayType",
        "bizCharEnumSpecLst": [
          {
            "code": "0",
            "value": "否",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "1",
            "value": "是",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "统谈统签统付业务",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8047",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "askForPaylevel",
        "bizCharEnumSpecLst": [
          {
            "code": "1",
            "value": "全国",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "全省",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "3",
            "value": "地市",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "4",
            "value": "区县",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "统谈级别",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8048",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "askForPayName",
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "统谈催缴人姓名",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8049",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "askForPayPhone",
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "统谈催缴人电话",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8050",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "payAccountFL",
        "bizCharEnumSpecLst": [
          {
            "code": "1",
            "value": "政府类",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "2",
            "value": "企业类",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "付费主体一级标签",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "8051",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": "payAccountSL",
        "bizCharEnumSpecLst": [
          {
            "code": "11",
            "value": "省市政府机关",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "12",
            "value": "县乡及以下级别政府机关",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "13",
            "value": "事业单位",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "14",
            "value": "平台公司",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "15",
            "value": "军队",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "21",
            "value": "央国企",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "22",
            "value": "大型民企",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "23",
            "value": "中型民企",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "24",
            "value": "小微企业",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          },
          {
            "code": "25",
            "value": "个体工商户",
            "parentCode": null,
            "status": null,
            "enumCode": null,
            "enumValue": null,
            "sign": null,
            "parentParam": null
          }
        ],
        "charType": "1",
        "charName": "付费主体二级标签",
        "displayType": 0,
        "groupNum": "businessTag",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "7835",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "CT项目甩单流水号",
        "displayType": 0,
        "groupNum": "pkgSeq",
        "optionalFlag": 1,
        "showLine": "0"
      },
      {
        "charNum": "7836",
        "charValue": null,
        "charDisplay": null,
        "prodordAttachFiles": [],
        "alias": null,
        "bizCharEnumSpecLst": null,
        "charType": "2",
        "charName": "CT甩单合同编码",
        "displayType": 0,
        "groupNum": "contractCode",
        "optionalFlag": 1,
        "showLine": "0"
      }
    ],
    "selectedSkuNum": [
      "2025999480006336"
    ],
    "prodordSkus": [
      {
        "skuNum": "2025999480006336",
        "action": null,
        "baseSku": null,
        "isBackTracking": 0,
        "productType": "2",
        "operationSubType": "1",
        "skuInstNum": "2025999480006336001",
        "skuInstName": "企业学培-尊享包",
        "skuBusinessNum": "12025999480006336",
        "skuBusinessName": "业务受理",
        "skuInstBusinessNum": "12025999480006336001",
        "prodordCharacters": [
          {
            "charNum": "6001702001",
            "charValue": "01",
            "charDisplay": "统付",
            "prodordAttachFiles": [],
            "alias": "UnifiedPaymentType",
            "bizCharEnumSpecLst": [
              {
                "code": "01",
                "value": "统付",
                "parentCode": null,
                "status": null,
                "enumCode": null,
                "enumValue": null,
                "sign": null,
                "parentParam": null
              },
              {
                "code": "02",
                "value": "个付",
                "parentCode": null,
                "status": null,
                "enumCode": null,
                "enumValue": null,
                "sign": null,
                "parentParam": null
              }
            ],
            "charType": "1",
            "charName": "统付类型",
            "groupNum": null,
            "optionalFlag": 0,
            "showLine": "0"
          },
          {
            "charNum": "6001702002",
            "charValue": "2",
            "charDisplay": null,
            "prodordAttachFiles": [],
            "alias": null,
            "bizCharEnumSpecLst": null,
            "charType": "2",
            "charName": "企业管理员姓名",
            "groupNum": null,
            "optionalFlag": 0,
            "showLine": "0"
          },
          {
            "charNum": "6001702003",
            "charValue": "13246456234",
            "charDisplay": null,
            "prodordAttachFiles": [],
            "alias": null,
            "bizCharEnumSpecLst": null,
            "charType": "2",
            "charName": "企业管理员手机号码",
            "groupNum": null,
            "optionalFlag": 0,
            "showLine": "0"
          },
          {
            "charNum": "6001702004",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": [],
            "alias": null,
            "bizCharEnumSpecLst": null,
            "charType": "2",
            "charName": "企业管理员邮箱",
            "groupNum": null,
            "optionalFlag": 1,
            "showLine": "0"
          },
          {
            "charNum": "6001702005",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": [],
            "alias": null,
            "bizCharEnumSpecLst": null,
            "charType": "3",
            "charName": "业务需求描述",
            "groupNum": null,
            "optionalFlag": 1,
            "showLine": "0"
          }
        ],
        "prodordTemplate": [
          {
            "charNum": "070128701",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": []
          },
          {
            "charNum": "070128801",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": []
          },
          {
            "charNum": "070128901",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": []
          },
          {
            "charNum": "070129001",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": []
          },
          {
            "charNum": "070129101",
            "charValue": null,
            "charDisplay": null,
            "prodordAttachFiles": []
          }
        ],
        "selectedTemplateNums": [
          "701287"
        ]
      }
    ]
  },
  "offerNum": "60017",
  "alias": "busiOpportunity_dictProjectId",
  "operationType": "1",
  "operation": "addOrder",
  "orderSource": "web",
  "select_3310": "kh001",
  "input_2201": "23",
  "select_4644": "选项1"
}
  ebRef.value?.setData(value);
}
</script>

<template>
  <div>
    <Button @click="onValidate">校验</Button>
    <Button @click="onReset">重置表单</Button>
    <Button @click="onSetValue">设置值</Button>
    <EBuilder ref="ebRef" :page-schema="pageSchema" />
  </div>
</template>
