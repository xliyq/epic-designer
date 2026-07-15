/**
 * 账务接口数据转 epic-designer 表单 schema 工具库
 *
 * 转换规则:
 * data.[0].bizCommonCharSpecLst   -> 账务信息（valueJPath 字段为顶层 select，alias 字段归入 attribute-group）
 * data.[0].bizPackageCharSpecLst  -> 业务属性（全部归入 attribute-group，field="poordCharacters"）
 * data.[0].bizSkuSpecLst          -> 商品选择（radio/checkbox + section-group + 嵌套 attribute-group）
 *
 * 使用 epic-designer 原生组件组合:
 *   section-group + section-template + attribute-group + card
 */
import { pick } from 'lodash-es';
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
 * 字段定义（通用属性）
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
    displayOrder?: number;
    toBossFlag?: number;
}

/**
 * SKU 属性字段（比通用属性多 SKU 级字段）
 */
export interface SkuCharSpec extends FieldSpec {
    nodeNum?: string | null;
    backOptionalFlag?: number | null;
    /** 0=可编辑, 1=只读, 2=隐藏 */
    readonly?: number;
    toBossFlag?: number;
    displayOrder?: number;
    enumSql?: string;
    provInterfaceNum?: string | null;
    displayRange?: string;
    displayClass?: string;
    prodordAttachFiles?: any[];
    note?: string;
    storageId?: string;
    fileName?: string;
    action?: string;
    prodistAttachFiles?: any;
}

/**
 * ICB 参数定义（产品资费参数）
 */
export interface IcbSpec {
    parameterNum: string;
    parameterName: string;
    parameterValue?: string;
    parameterUnitType?: string;
    parameterUnitDesc?: string;
    parameterDescribe?: string;
    maxValue?: string;
    minValue?: string;
    regular?: string;
    /** 0=可编辑, 1=只读 */
    displayType?: number;
    alias?: string;
    archiveFlag?: string;
    chargeCode?: string;
    chargeName?: string;
    inputType?: string;
    placeHolder?: string;
}

/**
 * 产品资费定义
 */
export interface RateTemplateSpec {
    templateNum: string;
    templateName: string;
    description?: string;
    alias?: string;
    componentType?: string;
    /** "checkbox" 等 */
    optType?: string;
    templateType?: string;
    rateTmplType?: string;
    defaultFlag?: string;
    optionalFlag?: string;
    displayType?: number;
    bizIcbSpecLst?: IcbSpec[];
}

/**
 * SKU 规格
 */
export interface SkuSpec {
    skuName?: string;
    skuNum?: string;
    productType?: string;
    skuInstNum?: string;
    skuInstName?: string;
    skuBusinessNum?: string;
    skuBusinessName?: string;
    skuInstBusinessNum?: string;
    operationSubType?: string;
    optionalFlag?: string;
    /** "radio" | "checkbox" */
    optType?: string;
    /** "1"=单选, "n"=多选 */
    limitCount?: string;
    bizCharSpecLst?: SkuCharSpec[];
    bizRateTempSpecLst?: RateTemplateSpec[];
    isBackTracking?: number;
    prodistSkuNum?: string;
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
        offerBind?: string;
        alias?: string;
        description?: string;
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
 * 解析 valueJPath 字段
 * 格式: "/nameField$$/numField"
 * @param jpath - valueJPath 字符串
 * @returns { nameField, numField } 或 null
 */
export function parseValueJPath(jpath: string): { nameField: string; numField: string } | null {
    if (!jpath || typeof jpath !== 'string') {
        return null;
    }
    // 去掉前导斜杠，按 "$$/" 或 "/" 分割
    const cleaned = jpath.replace(/^\//, '');
    const parts = cleaned.split(/\$\$\/?/);
    if (parts.length >= 2) {
        return { nameField: parts[0], numField: parts[1] };
    }
    // 兜底：单段路径
    if (parts.length === 1 && parts[0]) {
        return { nameField: parts[0] + 'Name', numField: parts[0] };
    }
    return null;
}

/**
 * 判断字段对应的组件类型
 * @param field - 字段对象
 * @returns 组件类型: input | select | textarea | date | upload-file
 */
export function getComponentType(field: FieldSpec): string {
    const charType = field.charType;
    const hasEnum = field.bizCharEnumSpecLst && field.bizCharEnumSpecLst.length > 0;

    // charType=2 文本输入
    if (charType === '2') {
        return 'input';
    }

    // charType=3 多行文本
    if (charType === '3') {
        return 'textarea';
    }

    // charType=8 日期选择
    if (charType === '8') {
        return 'date';
    }

    // charType=4 文件上传
    if (charType === '4') {
        return 'upload-file';
    }

    // charType=22 渠道编码（简化为 input）
    if (charType === '22') {
        return 'input';
    }

    // charType=1 有枚举 -> select
    if (charType === '1') {
        return 'select';
    }

    // 兜底：有枚举用 select，否则 input
    if (hasEnum) {
        return 'select';
    }

    return 'input';
}

/**
 * 生成 options（仅 select/radio/checkbox 类型使用）
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
 * @returns rules 数组
 */
export function generateRules(field: FieldSpec): any[] {
    const rules: any[] = [];

    // 必填校验（optionalFlag=0 表示必填，兼容 number/string 两种类型）
    if (String(field.optionalFlag) === '0') {
        rules.push({
            required: true,
            message: `${field.charName}为必填项`,
            trigger: ['change', 'blur']
        });
    }

    // 正则校验
    if (field.regular) {
        rules.push({
            pattern: field.regular,
            message: `${field.charName}格式不正确`,
            trigger: ['change', 'blur']
        });
    }

    return rules;
}

/**
 * 生成字段 props（通用字段属性）
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
            props.placeholder = `请选择${field.charName}`;
        } else if (componentType === 'date') {
            props.placeholder = `请选择${field.charName}`;
        } else if (componentType === 'upload-file') {
            props.placeholder = `请上传${field.charName}`;
        } else {
            props.placeholder = `请输入${field.charName}`;
        }
    }

    // select 类型添加 options
    if (componentType === 'select') {
        props.effect = 'light';
        props.options = generateOptions(field.bizCharEnumSpecLst);
        props.placement = 'bottom-start';
        props.size = 'default';
        props.fitInputWidth = true;
    }

    // input/textarea 类型添加 maxlength
    if ((componentType === 'input' || componentType === 'textarea') && field.maxLength) {
        props.maxlength = field.maxLength;
        props.showWordLimit = true;
    }

    // 上传文件类型
    if (componentType === 'upload-file') {
        props.action = '';
        props.name = 'file';
        props.showFileList = true;
    }

    // SKU 字段的 readonly 属性
    const skuField = field as SkuCharSpec;
    if (skuField.readonly === 1) {
        props.readonly = true;
    }

    // metaOverrides
    
    const metaOverrides:Record<string,any>= pick(field,['alias','bizCharEnumSpecLst','charType','charName','displayType','groupNum','optionalFlag','showLine']);
    if(metaOverrides){
        props.metaOverrides =JSON.stringify(metaOverrides);
    }

    return props;
}

/**
 * 将字段转换为 attribute-group 子组件格式
 *
 * attribute-group 子组件特点:
 *   - 不设 field（运行时会清空）
 *   - 设 props.charNum = 原始 charNum
 *   - 设 props.syncFields 声明数据同步字段
 *   - 设 label = charName
 *   - select 类型设 props.options
 *
 * @param field - 字段对象
 * @returns attribute-group 子组件 schema
 */
export function convertFieldToAttrGroupChild(field: FieldSpec | SkuCharSpec): Record<string, any> {
    const componentType = getComponentType(field);
    const charNum = field.charNum || '';

    // 根据 select/input 确定 syncFields
    let syncFields: string[];
    if (componentType === 'select' || componentType === 'radio') {
        // select/radio 同步 charValue(code) 和 charDisplay(label)
        syncFields = ['charValue', 'charDisplay'];
    } else if (componentType === 'checkbox') {
        // checkbox 同步 charValue(逗号拼接)
        syncFields = ['charValue', 'charDisplay'];
    } else if (componentType === 'upload-file') {
        // upload-file 同步 charValue 和 prodordAttachFiles
        syncFields = ['charValue', 'prodordAttachFiles'];
    } else {
        // input/textarea/date 只同步 charValue
        syncFields = ['charValue'];
    }

    const props = generateProps(field, componentType);
    props.charNum = charNum;
    props.syncFields = syncFields;

    // valueJPath 字段标记：提交时 SubmitBuilder 需根据此标记将 charValue/charDisplay
    // 拆分到顶层字段（如 orderModeNum/orderModeName）
    if (field.valueJPath) {
        const parsed = parseValueJPath(field.valueJPath);
        if (parsed) {
            props.valueJPath = field.valueJPath;
            props.valueJPathNameField = parsed.nameField;
            props.valueJPathNumField = parsed.numField;
        }
    }

    const child: Record<string, any> = {
        type: componentType,
        label: field.charName,
        input: true,
        id: `attr_${charNum}_${generateShortId()}`,
        props
    };

    // 添加校验规则
    const rules = generateRules(field);
    if (rules.length > 0) {
        child.rules = rules;
    }

    return child;
}

/**
 * 构建 valueJPath 字段（顶层 select）
 *
 * valueJPath 格式 "/nameField$$/numField"
 * 渲染为 select，field = numField，options value=code, label=value
 * nameField（如 orderModeName）在提交时由 SubmitBuilder 根据 code 反查补全
 *
 * @param field - 字段对象
 * @returns select 组件 schema
 */
export function buildValueJPathField(field: FieldSpec): Record<string, any> {
    const parsed = parseValueJPath(field.valueJPath || '');
    const numField = parsed ? parsed.numField : field.charNum;

    const options = generateOptions(field.bizCharEnumSpecLst);
    const props: Record<string, any> = {
        effect: 'light',
        dataSource:{
            type:'static',
            config:{
                 options,
            }
        },
        placeholder: field.placeHolder || `请选择${field.charName}`,
        placement: 'bottom-start',
        size: 'default',
        fitInputWidth: true
    };

    const component: Record<string, any> = {
        type: 'select',
        field: numField,
        label: field.charName,
        input: true,
        id: `select_${numField}_${generateShortId()}`,
        props
    };

    // 校验规则
    const rules = generateRules(field);
    if (rules.length > 0) {
        component.rules = rules;
    }

    return component;
}

/**
 * 创建 card 节点
 * @param label - 卡片标签
 * @param children - 子组件列表
 * @param options - 配置选项
 * @param id - 节点 id
 * @returns card 节点
 */
export function createCard(label: string, children: any[], options: { gridCols?: number; gridEnable?: boolean; hidden?: boolean } = {}, id?: string): Record<string, any> {
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

/**
 * 将 ICB 参数转换为 attribute-group 子组件格式
 * ICB 参数统一用 input 组件
 *
 * @param icb - ICB 参数定义
 * @param templateNum - 所属模板编号
 * @returns attribute-group 子组件 schema
 */
function convertIcbToAttrGroupChild(icb: IcbSpec, templateNum: string): Record<string, any> {
    const isReadonly = icb.displayType === 1;
    const labelParts = [icb.parameterName];
    if (icb.parameterDescribe) {
        labelParts.push(icb.parameterDescribe);
    }
    if (icb.parameterUnitDesc) {
        labelParts.push(`(${icb.parameterUnitDesc})`);
    }

    const props: Record<string, any> = {
        charNum: icb.parameterNum,
        syncFields: ['charValue'],
        placeholder: icb.placeHolder || `请输入${icb.parameterName}`
    };

    // 只读
    if (isReadonly) {
        props.readonly = true;
    }

    // 如果有默认值
    if (icb.parameterValue) {
        props.defaultValue = icb.parameterValue;
    }

    const child: Record<string, any> = {
        type: 'input',
        label: labelParts.join(' '),
        input: true,
        id: `icb_${icb.parameterNum}_${generateShortId()}`,
        props
    };

    // 正则校验
    if (icb.regular) {
        child.rules = [{
            pattern: icb.regular,
            message: `${icb.parameterName}格式不正确`,
            trigger: ['change', 'blur']
        }];
    }

    return child;
}

/**
 * 构建 SKU section-template 内部的子组件列表
 *
 * 每个 SKU 的 section-template 内部包含:
 *   0. card "附加信息" - 隐藏字段（action、a、b），数据平铺到 sku item 根节点
 *   1. attribute-group (field="prodordCharacters") - SKU 属性
 *   2. checkbox (field="selectedTemplateNums") - 产品资费选择
 *   3. attribute-group (field="prodordTemplate") - 产品资费 ICB 参数（平铺，不做显隐联动）
 *
 * @param sku - SKU 规格
 * @returns 子组件 schema 数组
 */
function buildSkuTemplateChildren(sku: SkuSpec): any[] {
    const children: any[] = [];

    // 0. 附加信息（card 视觉容器，默认隐藏，数据平铺到 sku item 根节点）
    //    section-group 引擎会将 card 内部子组件的 field 直接绑定到 item 对象
    children.push({
        type: 'card',
        label: '附加信息',
        props: {
            gridEnable: true,
            gridCols: 4
        },
        id: `card_extra`,
        children: [
            {
                type: 'text-view',
                field: 'action',
                label: 'action',
                input: true,
                id: `extra_action`,
                props: {
                    placeholder: '',
                    defaultValue: null
                }
            },
            {
                 type: 'text-view',
                field: 'baseSku',
                label: 'baseSku',
                input: true,
                id: `extra_baseSku`,
                props: {
                    placeholder: '',
                    defaultValue: null
                }
            },
            {
                type: 'text-view',
                field: 'isBackTracking',
                label: 'isBackTracking',
                input: true,
                id: `extra_isBackTracking`,
                props: {
                  placeholder: '',
                  defaultValue:  sku.isBackTracking || 0
                }
            }
        ]
    });

    // 1. SKU 属性（attribute-group）
    const skuFields = (sku.bizCharSpecLst || []).filter(f => (f as SkuCharSpec).readonly !== 2);
    if (skuFields.length > 0) {
        children.push({
            type: 'attribute-group',
            field: 'prodordCharacters',
            label: '产品属性',
            hideLabel: true,
            input: true,
            id: `attrgroup_sku_prodordCharacters_${sku.skuNum}`,
            props: {
                title: '产品属性',
                bordered: true,
                collapsible: false,
                gridEnable: true,
                gridCols: 2
            },
            children: skuFields.map(f => convertFieldToAttrGroupChild(f))
        });
    }

    // 2. 产品资费选择 + ICB 参数
    const rateTemplates = sku.bizRateTempSpecLst || [];
    if (rateTemplates.length > 0) {
        // 产品资费选择 checkbox
        children.push({
            type: 'checkbox',
            field: 'selectedTemplateNums',
            label: '产品资费',
            input: true,
            id: `checkbox_tpl_${sku.skuNum}_${generateShortId()}`,
            props: {
                dataSource:{
                    type:'static',
                    config:{
                        options: rateTemplates.map(t => ({
                            label: t.description,
                            value: t.templateNum
                        }))
                    }
                }
            },
            rules: [{
                required: true,
                message: '请至少选择一个产品资费',
                trigger: ['change'],
                type: 'array'
            }]
        });

        // 所有产品资费的 ICB 参数平铺到一个 attribute-group
        const allIcbs: Array<{ icb: IcbSpec; templateNum: string }> = [];
        for (const tmpl of rateTemplates) {
            const icbList = tmpl.bizIcbSpecLst || [];
            for (const icb of icbList) {
                allIcbs.push({ icb, templateNum: tmpl.templateNum });
            }
        }

        if (allIcbs.length > 0) {
            children.push({
                type: 'attribute-group',
                field: 'prodordTemplate',
                label: '资费参数',
                hideLabel: true,
                input: true,
                id: `attrgroup_sku_prodordTemplate_${sku.skuNum}`,
                props: {
                    title: '资费参数',
                    bordered: true,
                    collapsible: false,
                    gridEnable: true,
                    gridCols: 2
                },
                children: allIcbs.map(({ icb, templateNum }) => convertIcbToAttrGroupChild(icb, templateNum))
            });
        }
    }

    return children;
}

/**
 * 构建 SKU 选择区
 *
 * 结构:
 *   card "商品选择"
 *   ├── radio/checkbox (field="selectedSkuNum") - SKU 选择控件
 *   └── section-group (field="prodordSkus")
 *       └── section-template × N (每个 SKU 一个，optionKey=skuNum)
 *           ├── attribute-group (field="prodordCharacters") - SKU 属性
 *           ├── checkbox (field="selectedTemplateNums") - 产品资费选择
 *           └── attribute-group (field="prodordTemplate") - ICB 参数
 *
 * @param skuList - SKU 列表
 * @returns card 节点
 */
export function buildSkuSection(skuList: SkuSpec[]): any[] {
    // 根据第一个 SKU 的 limitCount 判断单选/多选
    const limitCount = skuList[0]?.limitCount || 'n';
    const selectType = limitCount === '1' ? 'radio' : 'checkbox';

    // SKU 选择控件
    // field 加 "package." 前缀，使数据写入 formData.package.selectedSkuNum
    const selectField: Record<string, any> = {
        type: selectType,
        field: 'package.selectedSkuNum',
        label: '选择商品',
        input: true,
        id: 'selectedSkuNum',
        props: {
            dataSource:{
                type:'static',
                config:{
                    options: skuList.map(s => ({
                        label: s.skuName,
                        value: s.skuNum,
                        skuName: s.skuName,
                        productType: s.productType,
                        skuInstNum:s.skuInstNum,
                        skuInstName: s.skuInstName,
                        skuBusinessNum: s.skuBusinessNum,
                        skuBusinessName: s.skuBusinessName,
                        skuInstBusinessNum: s.skuInstBusinessNum,
                        baseSku: s.baseSku,
                        operationSubType: s.operationSubType,
                        operationAction:s.operationAction
                    }))
                }
            }
        }
    };

    // 单选时必填校验用 string 类型，多选用 array 类型
    if (selectType === 'radio') {
        selectField.rules = [{
            required: true,
            message: '请选择商品',
            trigger: ['change'],
            type: 'string'
        }];
    } else {
        selectField.rules = [{
            required: true,
            message: '请至少选择一个商品',
            trigger: ['change'],
            type: 'array'
        }];
    }

    // section-group
    // field 加 "package." 前缀，产出 formData.package.prodordSkus
    // selectionField 也加前缀，因为 section-group 的 watch 用 getValueByPath(formData, path) 直接读
    const sectionGroup: Record<string, any> = {
        type: 'section-group',
        field: 'package.prodordSkus',
        label: '商品信息',
        hideLabel: true,
        input: true,
        id: 'section_prodordSkus',
        props: {
            title: '商品信息',
            keyField: 'skuNum',
            selectionField: 'package.selectedSkuNum',
            bordered: true,
            collapsible: false
        },
        children: skuList.map(sku => ({
            type: 'section-template',
            label: sku.skuName,
            props: {
                optionKey: sku.skuNum
            },
            id: `sku_tpl_${sku.skuNum}`,
            children: buildSkuTemplateChildren(sku)
        }))
    };

    // 不额外包裹 card，radio/checkbox 和 section-group 直接作为 form children
    // section-group 自带 title + bordered，视觉上已是独立区块
    return [selectField, sectionGroup];
}

/**
 * 客户信息 schema（保留原有不变）
 */
export function commonCustomerSchema(): Record<string, any> {
    const components = [
        {
            field: 'select_3310',
            input: true,
            label: '客户名称',
            props: {
                effect: 'light',
                dataSource:{
                    type:'static',
                    config:{
                        options: [
                            { label: '客户1', value: 'kh001' },
                            { label: '客户2', value: 'kh002' }
                        ]
                    }
                },
                placeholder: '请选择',
                placement: 'bottom-start',
                size: 'default',
                fitInputWidth: true
            },
            type: 'select',
            id: 'select_3310',
            rules: [
                {
                    message: '必填项',
                    required: true,
                    trigger: ['change'],
                    type: 'string'
                }
            ],
            on: {
                change: [
                    {
                        componentId: 'select_3310',
                        methodName: 'test',
                        type: 'custom'
                    }
                ]
            }
        },
        {
            field: 'input_2201',
            input: true,
            label: '客户编码',
            props: {
                placeholder: '请输入',
                readonly: true
            },
            type: 'input',
            id: 'input_2201',
            rules: [
                {
                    message: '必填项',
                    required: true,
                    trigger: ['change'],
                    type: 'string'
                }
            ]
        },
        {
            field: 'select_4644',
            input: true,
            label: '添加合同',
            props: {
                effect: 'light',
                dataSource:{
                    type:'static',
                    config:{
                        options: [
                            { label: '选项1', value: '选项1' },
                            { label: '选项2', value: '选项2' }
                        ]
                    }
                },
                placeholder: '请选择',
                placement: 'bottom-start',
                size: 'default'
            },
            type: 'select',
            id: 'select_4644',
            rules: [
                {
                    message: '必填项',
                    required: true,
                    trigger: ['change'],
                    type: 'string'
                }
            ]
        },
        {
            field: 'input_1721',
            input: true,
            label: '全网商机编码',
            props: {
                placeholder: '请输入'
            },
            type: 'input',
            id: 'input_1721'
        },
        {
            field: 'input_9236',
            input: true,
            label: '全网项目编码',
            props: {
                placeholder: '请输入'
            },
            type: 'input',
            id: 'input_9236'
        }
    ];

    return createCard('客户信息', components, {
        gridCols: 4,
        gridEnable: true
    });
}

/**
 * 构建订购信息卡片（只读展示）
 * field 加 "package." 前缀，使 formData 产出 { package: { ... } } 嵌套结构，对齐 JSON-B 的 packages[0]
 */
function buildOrderInfoCard(data: any): Record<string, any> {
    const textViewFields = [
        { field: 'package.packageName', label: '套餐名称', id: 'packageName', key: 'packageName' },
        { field: 'package.packageNum',  label: '套餐编码', id: 'packageNum',  key: 'packageNum' },
        { field: 'package.offerName',   label: '商品名称', id: 'offerName',   key: 'offerName' },
        { field: 'offerNum',    label: '商品编码', id: 'offerNum',    key: 'offerNum' },
        { field: 'package.description', label: '套餐描述', id: 'description', key: 'description', span: 4 },
        { field: 'package.packageBusinessName', label: '业务名称', id: 'packageBusinessName', key: 'packageBusinessName' },
        { field: 'package.packageBusinessNum', label: '业务编码', id: 'packageBusinessNum', key: 'packageBusinessNum' },
        { field: 'package.offerType', label: '类型', id: 'offerType', key: 'offerType' },
        { field: 'alias', label: '别名', id: 'alias', key: 'alias' },
        { field: 'operationType', label: 'operationType', id: 'operationType', key: 'operationType' },
        { field: 'operation', label: 'operation', id: 'operation', key: 'operation',defaultValue:'addOrder' },
        { field: 'orderSource', label: 'orderSource', id: 'orderSource', key: 'orderSource',defaultValue:'web'},
    ];

    return createCard('订购信息', textViewFields.map(f => ({
        type: 'text-view',
        field: f.field,
        label: f.label,
        input: true,
        id: f.id,
        props: {
            defaultValue: data[f.key] || f.defaultValue|| '',
            readonly: true,
            placeholder: '',
            ...(f.span ? { span: f.span } : {}),
        },
    })), { gridEnable: true, gridCols: 4 });
}

/**
 * 从接口数据生成表单 schema
 *
 * 转换流程:
 *   1. 客户信息（固定 schema）
 *   2. 订购信息（只读展示 packageName/offerName）
 *   3. 账务信息（bizCommonCharSpecLst: valueJPath 字段 -> 顶层 select; alias 字段 -> attribute-group）
 *   4. 业务属性（bizPackageCharSpecLst -> attribute-group field="poordCharacters"）
 *   5. 商品选择（bizSkuSpecLst -> radio/checkbox + section-group + 嵌套 attribute-group）
 *
 * @param response - 接口响应对象 { data: [...] }
 * @returns 表单 schema 数组
 */
export function generateFormSchema(response: any): any[] {
    const data = response?.data?.[0] || {};

    // 表单根节点
    const formSchema: Record<string, any> = {
        id: 'root',
        type: 'form',
        label: '订购表单',
        props: {
            name: 'default',
            labelWidth: '120px',
            labelPosition: 'right',
            labelLayout: 'fixed',
            labelAlign: 'right',
            layout: 'horizontal',
            colon: true,
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            labelSuffix: ':'
        },
        children: []
    };
    // 0.1. 订购信息（只读展示）
    formSchema.children.push(buildOrderInfoCard(data));
    // 0. 客户信息（固定 schema）
    formSchema.children.push(commonCustomerSchema());

     // 1. 商品选择（bizSkuSpecLst -> radio/checkbox + section-group）
    const skuList: SkuSpec[] = data.bizSkuSpecLst || [];
    if (skuList.length > 0) {
        formSchema.children.push(...buildSkuSection(skuList));
    }
    // 2. 账务信息（bizCommonCharSpecLst 全部统一进 attribute-group）
    //    valueJPath 字段和 alias 字段混合，数据统一产出为 [{ charNum, charValue, charDisplay }] 数组
    //    提交时 SubmitBuilder 根据 valueJPath 拆分到顶层 orderModeNum/orderModeName 等
    const commonCharList: FieldSpec[] = data.bizCommonCharSpecLst || [];

    if (commonCharList.length > 0) {
        formSchema.children.push({
            type: 'attribute-group',
            field: 'package.poordExtendCharacters',
            label: '账务信息',
            hideLabel: true,
            input: true,
            id: 'attrgroup_poordExtendCharacters',
            props: {
                title: '账务信息',
                bordered: true,
                collapsible: false,
                gridEnable: true,
                gridCols: 4
            },
            children: commonCharList.map(f => convertFieldToAttrGroupChild(f))
        });
    }

    // 3. 业务属性（bizPackageCharSpecLst -> 单个 attribute-group，field="package.poordCharacters"）
    //    按子组件的 props.groupLabel 做视觉分组，数据统一在一个数组里，getData() 直接拿到合并结果
    const pkgCharSpecList: FieldSpec[] = data.bizPackageCharSpecLst || [];
    const GROUP_LABELS: Record<string, string> = {
        'channel': '渠道信息',
        'businessTag': '业务标签',
        'payment': '付费信息',
        'pkgSeq': '甩单信息',
        'contractCode': '合同信息'
    };

    if (pkgCharSpecList.length > 0) {
        // 按预定义分组顺序排序，同组字段挨在一起，无 groupNum 的排最后
        const GROUP_ORDER = ['channel', 'businessTag', 'payment', 'pkgSeq', 'contractCode'];
        const sortedList = [...pkgCharSpecList].sort((a, b) => {
            const ai = a.groupNum ? GROUP_ORDER.indexOf(a.groupNum) : 999;
            const bi = b.groupNum ? GROUP_ORDER.indexOf(b.groupNum) : 999;
            return ai - bi;
        });

        formSchema.children.push({
            type: 'attribute-group',
            field: 'package.poordCharacters',
            label: '业务属性',
            hideLabel: true,
            input: true,
            id: 'attrgroup_poordCharacters',
            props: {
                title: '业务属性',
                bordered: true,
                collapsible: false,
                gridEnable: true,
                gridCols: 4
            },
            children: sortedList.map(f => {
                const child = convertFieldToAttrGroupChild(f);
                // 注入 groupLabel 供 attribute-group 运行时分组渲染
                if (f.groupNum && GROUP_LABELS[f.groupNum]) {
                    child.props.groupLabel = GROUP_LABELS[f.groupNum];
                }
                return child;
            })
        });
    }

   

    return [formSchema];
}
