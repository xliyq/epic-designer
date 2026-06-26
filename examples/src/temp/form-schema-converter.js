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
function generateShortId() {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * 判断字段对应的组件类型
 * @param {Object} field - 字段对象
 * @returns {string} 组件类型: input | select | number | upload-file
 */
function getComponentType(field) {
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
 * @param {Array} enumList - bizCharEnumSpecLst
 * @returns {Array} options 数组
 */
function generateOptions(enumList) {
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
 * @param {Object} field - 字段对象
 * @param {string} componentType - 组件类型
 * @returns {Array} rules 数组
 */
function generateRules(field, componentType) {
    const rules = [];
    
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
 * @param {Object} field - 字段对象
 * @param {string} componentType - 组件类型
 * @returns {Object} props 对象
 */
function generateProps(field, componentType) {
    const props = {};
    
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
 * @param {Array} fields - 字段列表
 * @returns {Array} 组件 schema 数组
 */
function convertFieldsToComponents(fields) {
    if (!Array.isArray(fields)) {
        return [];
    }
    
    return fields.map(field => {
        const componentType = getComponentType(field);
        const charNum = field.charNum || '';
        const fieldName = `${componentType}_${charNum}`;
        
        const component = {
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
 * @param {string} label - 卡片标签
 * @param {Array} children - 子组件列表
 * @param {Object} options - 配置选项
 * @returns {Object} card 节点
 */
function createCard(label, children, options = {}) {
    const card = {
        label: label,
        type: 'card',
        props: {
            style: {
                margin: '10px'
            },
            ...(options.gridCols ? { gridCols: options.gridCols } : {}),
            ...(options.gridEnable !== undefined ? { gridEnable: options.gridEnable } : {})
        },
        children: children,
        id: `card_${generateShortId()}`
    };
    
    return card;
}

/**
 * 从接口数据生成表单 schema
 * @param {Object} response - 接口响应对象 { data: [...] }
 * @returns {Array} 表单 schema 数组
 */
function generateFormSchema(response) {
    const data = response.data && response.data[0] ? response.data[0] : {};
    
    const formSchema = {
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

    // 1. 选择产品（来自 bizSkuSpecLst）
    // 每个 SKU 作为一个子 card 放在"选择产品" card 中
    const skuList = data.bizSkuSpecLst || [];
    if (skuList.length > 0) {
        const productCard = createCard('选择产品', [], {
            gridCols: 4,
            gridEnable: true
        });
        
        const skuCards = [];
        for (const sku of skuList) {
            const skuName = sku.skuName || sku.skuNum || '未知产品';
            const skuFields = sku.bizCharSpecLst || [];
            
            // 将 SKU 字段转换为组件
            const components = convertFieldsToComponents(skuFields);
            if (components.length > 0) {
                const skuCard = createCard(skuName, components, {
                    gridCols: 4,
                    gridEnable: true
                });
                productCard.children.push(skuCard);
            }
        }
        
        // 如果产品 card 有内容，添加到表单
        if (productCard.children.length > 0) {
            formSchema.children.push(productCard);
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
    const groupMap = {
        'operaterInfo': '经办人信息',
        'channel': '渠道信息',
        'businessTag': '业务标签',
        'corporateInfo': '法人信息'
    };
    
    const pkgCharSpec = data.bizPackageCharSpecLst || [];
    const groupedFields = {};
    
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

// 导出函数
export {
    generateFormSchema,
    convertFieldsToComponents,
    createCard,
    getComponentType,
    generateShortId
};

// 兼容 CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateFormSchema,
        convertFieldsToComponents,
        createCard,
        getComponentType,
        generateShortId
    };
}

// 浏览器环境
if (typeof window !== 'undefined') {
    window.AccountingFormConverter = {
        generateFormSchema,
        convertFieldsToComponents,
        createCard,
        getComponentType,
        generateShortId
    };
}
