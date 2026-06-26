/**
 * 账务接口数据转 epic-designer 表单 schema 工具库
 *
 * 参考格式: out.json
 *
 * 转换规则:
 * data.[0].bizSkuSpecLst    -> 选择产品（每个 SKU 作为一个子 card）
 * data.[0].bizCommonCharSpecLst   -> 账务信息 card
 * data.[0].bizPackageCharSpecLst  -> 按 groupNum 分组成多个 card
 *   groupNum=operaterInfo -> 经办人信息
 *   groupNum=channel      -> 渠道信息
 *   groupNum=businessTag  -> 业务标签
 *   groupNum=corporateInfo-> 法人信息
 */

/**
 * 生成短 UUID
 */
export function generateShortId(): string {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * 枚举选项
 */
export interface EnumOption {
    code: string;
    value: string;
    parentCode?: string | null;
    status?: string | null;
    enumCode?: string | null;
    enumValue?: string | null;
    sign?: string | null;
    parentParam?: string | null;
}

/**
 * 字段定义
 */
export interface FieldSpec {
    charNum: string;
    charName: string;
    charValue?: string | null;
    charDisplay?: string | null;
    optionalFlag: number;
    charType: string;
    placeHolder?: string | null;
    alias?: string | null;
    regular?: string | null;
    maxLength?: number | null;
    displayType: number;
    groupNum?: string | null;
    valueJPath?: string | null;
    bizCharEnumSpecLst?: EnumOption[];
    poordAttachFiles?: any[];
    promptFlag?: string | null;
    promptInfo?: string;
    showLine?: string | null;
    resetStyle?: string | null;
    goldType?: string | null;
}

/**
 * SKU 规格
 */
export interface SkuSpec {
    skuName?: string;
    skuNum?: string;
    bizCharSpecLst?: FieldSpec[];
}

/**
 * 接口响应数据
 */
export interface AccountingResponse {
    bizCode?: string;
    bizDesc?: string;
    data: {
        packageNum?: string;
        packageName?: string;
        offerNum?: string;
        offerName?: string;
        offerType?: string;
        operationType?: string;
        operationAction?: string | null;
        packageBusinessNum?: string;
        packageBusinessName?: string;
        approveFlag?: string;
        leaderApproveFlag?: string;
        deferBillNode?: string | null;
        bizPackageRateTempSpecLst?: any[];
        bizPackageChargeSpecLst?: any[];
        bizCommonCharSpecLst?: FieldSpec[];
        bizSkuSpecLst?: SkuSpec[];
        bizPackageCharSpecLst?: FieldSpec[];
    }[];
}

/**
 * 判断字段对应的组件类型
 * @param field - 字段对象
 * @returns 组件类型: input | select | number | upload-file
 */
export function getComponentType(field: FieldSpec): string {
    const charType = field.charType;
    const displayType = field.displayType;
    const hasEnum = field.bizCharEnumSpecLst && field.bizCharEnumSpecLst.length > 0;

    // 有枚举选项 → select（证件类型特殊处理）
    if (hasEnum) {
        if (field.charName && field.charName.includes('证件类型')) {
            return 'input';
        }
        return 'select';
    }

    // displayType=1 → number
    if (displayType == 1) {
        return 'number';
    }

    // charType=4 → upload-file
    if (charType == '4') {
        return 'upload-file';
    }

    // charType=8 → date（暂按 input 处理）
    if (charType == '8') {
        return 'input';
    }

    // 默认 input
    return 'input';
}

/**
 * 生成 options（仅 select 类型使用）
 * @param enumList - bizCharEnumSpecLst
 * @returns options 数组
 */
export function generateOptions(enumList: EnumOption[] | undefined): { label: string; value: string }[] {
    if (!enumList || !Array.isArray(enumList)) {
        return [];
    }
    return enumList.map(item => ({
        label: item.value || item.code,
        value: item.code || item.value
    }));
}

/**
 * 生成校验规则
 * @param field - 字段对象
 * @param componentType - 组件类型
 * @returns rules 数组
 */
export function generateRules(field: FieldSpec, componentType: string): { message: string; required: boolean; trigger: string[]; type: string }[] {
    const rules: { message: string; required: boolean; trigger: string[]; type: string }[] = [];

    // 必填校验
    if (field.optionalFlag == 0) {
        rules.push({
            message: '必填项',
            required: true,
            trigger: ['change'],
            type: componentType === 'number' ? 'number' : 'string'
        });
    }

    return rules;
}

/**
 * 生成字段 props
 * @param field - 字段对象
 * @param componentType - 组件类型
 * @returns props 对象
 */
export function generateProps(field: FieldSpec, componentType: string): Record<string, any> {
    const props: Record<string, any> = {};

    // placeholder
    if (field.placeHolder) {
        props.placeholder = field.placeHolder;
    } else {
        if (componentType === 'select') {
            props.placeholder = '请选择';
        } else if (componentType === 'upload-file') {
            props.placeholder = '请选择';
        } else {
            props.placeholder = '请输入';
        }
    }

    // select 类型添加 options
    if (componentType === 'select') {
        props.effect = 'light';
        props.options = generateOptions(field.bizCharEnumSpecLst);
        props.placement = 'bottom-start';
        props.size = 'default';
    }

    // 上传文件类型
    if (componentType === 'upload-file') {
        props.action = '';
        props.name = 'file';
        props.showFileList = true;
    }

    return props;
}

/**
 * 将字段列表转换为表单组件 schema
 * @param fields - 字段列表
 * @returns 组件 schema 数组
 */
export function convertFieldsToComponents(fields: FieldSpec[] | undefined): any[] {
    if (!Array.isArray(fields)) {
        return [];
    }

    return fields.map(field => {
        const componentType = getComponentType(field);
        const charNum = field.charNum || '';
        const fieldName = `${componentType}_${charNum}`;

        const component: Record<string, any> = {
            field: fieldName,
            input: true,
            label: field.charName,
            props: generateProps(field, componentType),
            type: componentType,
            id: fieldName
        };

        // 添加校验规则
        const rules = generateRules(field, componentType);
        if (rules.length > 0) {
            component.rules = rules;
        }

        return component;
    });
}

/**
 * 创建 card 节点
 * @param label - 卡片标签
 * @param children - 子组件列表
 * @param options - 配置选项
 * @returns card 节点
 */
export function createCard(label: string, children: any[], options: { gridCols?: number; gridEnable?: boolean; hidden?: boolean } = {},id?:string): Record<string, any> {
    const card: Record<string, any> = {
        label: label,
        type: 'card',
        props: {
            style: {
                margin: '10px'
            },
           ...options
        },
        children: children,
        id: id || `card_${generateShortId()}`
    };

    return card;
}

export function commonCustomerSchema(){
    const components = [
        {
      field: "select_3310",
      input: true,
      label: "客户名称",
      props: {
        effect: "light",
        options: [
          {
            label: "客户1",
            "value": "kh001"
          },
          {
            label: "客户2",
            "value": "kh002"
          }
        ],
        placeholder: "请选择",
        placement: "bottom-start",
        size: "default",
        fitInputWidth: true
      },
      type: "select",
     id: "select_3310",
      rules: [
        {
          "message": "必填项",
          "required": true,
          "trigger": [
            "change"
          ],
          type: "string"
        }
      ],
      "on": {
        "change": [
          {
            "componentId": "select_3310",
            "methodName": "test",
            type: "custom"
          }
        ]
      }
    },
    {
      field: "input_2201",
      input: true,
      label: "客户编码",
      props: {
        placeholder: "请输入",
        "readonly": true
      },
      type: "input",
     id: "input_2201",
      rules: [
        {
          "message": "必填项",
          "required": true,
          "trigger": [
            "change"
          ],
          type: "string"
        }
      ]
    },
    {
      field: "select_4644",
      input: true,
      label: "添加合同",
      props: {
        effect: "light",
        options: [
          {
            label: "选项1",
            "value": "选项1"
          },
          {
            label: "选项2",
            "value": "选项2"
          }
        ],
        placeholder: "请选择",
        placement: "bottom-start",
        size: "default"
      },
      type: "select",
     id: "select_4644",
      rules: [
        {
          "message": "必填项",
          "required": true,
          "trigger": [
            "change"
          ],
          type: "string"
        }
      ]
    },
    {
      field: "input_1721",
      input: true,
      label: "全网商机编码",
      props: {
        placeholder: "请输入"
      },
      type: "input",
     id: "input_1721"
    },
    {
      field: "input_9236",
      input: true,
      label: "全网项目编码",
      props: {
        placeholder: "请输入"
      },
      type: "input",
      id: "input_9236"
    }
    ]
    return createCard('客户信息',components,{
        gridCols: 4,
        gridEnable: true,
    });
}

/**
 * 从接口数据生成表单 schema
 * @param response - 接口响应对象 { data: [...] }
 * @returns 表单 schema 数组
 */
export function generateFormSchema(response: any): any[] {
    const data = response.data && response.data[0] ? response.data[0] : {};

    const formSchema: Record<string, any> = {
        id: 'root',
        label: '表单',
        type: 'form',
        props: {
            colon: true,
            labelAlign: 'right',
            labelCol: { span: 5 },
            labelLayout: 'fixed',
            labelPlacement: 'left',
            labelWidth: '120px',
            layout: 'horizontal',
            name: 'default',
            wrapperCol: { span: 19 },
            labelSuffix: ':'
        },
        children: []
    };

    formSchema.children.push(commonCustomerSchema())

    // 1. 选择产品（来自 bizSkuSpecLst）
    // 每个 SKU 作为一个子 card 放在"选择产品" card 中
    const skuList = data.bizSkuSpecLst || [];
    if (skuList.length > 0) {
        
        const skuOptions = []
        const skuCards = []
        for (const sku of skuList) {
            const skuName = sku.skuName || sku.skuNum || '未知产品';
            const skuFields = sku.bizCharSpecLst?.filter((item:any)=>item.readonly!=2) || [];
            const skuCard = createCard(skuName, [], {
                    // 隐藏
                    hidden: true
                },"skuCard_"+sku.skuNum);
            skuOptions.push({
                skuNum:sku.skuNum,
                skuName:sku.skuName,
                skuBusinessNum:sku.skuBusinessNum,
                skuInstBusinessNum:sku.skuInstBusinessNum,
                label:skuName,
                value:sku.skuNum
            })
            // 将 SKU 字段转换为组件 -- 属性
            const components = convertFieldsToComponents(skuFields);
            if (components.length > 0) {
                const skuSpecCard = createCard('产品属性', components, {
                    gridCols: 4,
                    gridEnable: true,
                },"skuCardSpec_"+sku.skuNum);

                skuCard.children.push(skuSpecCard)
            }

            // bizSkuRateTempGroupSpecLst 资费 
            
            const skuRateCard = createCard('产品资费', [], {
            },"skuRate_"+sku.skuNum);
             skuCard.children.push(skuRateCard)
            
            skuCards.push(skuCard);
        }
        const productCard = createCard('选择产品', [
            {
                field: "checkbox_7206",
                input: true,
                label: "",
                props: {
                    options: skuOptions
                },
                type: "checkbox",
                id: "checkbox_7206",
                 rules: [
                    {
                    message: "必填项",
                    required: true,
                    trigger: ["change"],
                    type: "array"
                    }
                ]
            }
        ], {
        });

        // 如果产品 card 有内容，添加到表单
        formSchema.children.push(productCard);
        
        if(skuCards.length > 0){
          formSchema.children.push(... skuCards);
        }
    }


    // 2. 账务信息（来自 bizCommonCharSpecLst）
    const accountingFields = convertFieldsToComponents(data.bizCommonCharSpecLst || []);
    if (accountingFields.length > 0) {
        formSchema.children.push(createCard('账务信息', accountingFields, {
            gridCols: 4,
            gridEnable: true
        }));
    }

    // 3. 产品公共属性（来自 bizPackageCharSpecLst，按 groupNum 分组）
    const groupMap: Record<string, string> = {
        'operaterInfo': '经办人信息',
        'channel': '渠道信息',
        'businessTag': '业务标签',
        'corporateInfo': '法人信息'
    };

    const pkgCharSpec = data.bizPackageCharSpecLst || [];
    const groupedFields: Record<string, FieldSpec[]> = {};

    for (const field of pkgCharSpec) {
        const groupNum = field.groupNum;
        if (groupNum && groupMap[groupNum]) {
            if (!groupedFields[groupNum]) {
                groupedFields[groupNum] = [];
            }
            groupedFields[groupNum].push(field);
        }
    }

    // 按分组生成 card
    for (const [groupNum, fields] of Object.entries(groupedFields)) {
        const cardLabel = groupMap[groupNum] || groupNum;
        const components = convertFieldsToComponents(fields);
        if (components.length > 0) {
            formSchema.children.push(createCard(cardLabel, components, {
                gridCols: 4,
                gridEnable: true
            }));
        }
    }


    // 4. 变更（来自 bizPackageChargeSpecLst，暂未实现具体字段映射）
    // 可根据实际需求扩展

    return [formSchema];
}
