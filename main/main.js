const database= require("../main/datbase.js");
module.exports = function main(inputs) {
    let allitems =database. loadAllItems();//获取所有的商品信息
    let discount = database.loadPromotions(); //获取所有的折扣信息
    let items = get_items(inputs, allitems);
    let promotions = get_promotion(items, discount);
    let expecteText = get_menu(items, promotions);
    console.log(expecteText);
};
function get_items(inputs, allitems) {
    let items = []; //返回输入的对象数组
    inputs.forEach(item => {
        let item_barcode = item.split('-')[0] ? item.split('-')[0] : item;
        let item_count = item.split('-')[1] ? parseInt(item.split('-')[1], 10) : 1;
        for(let i = 0; i < items.length; i++) {
            if(item_barcode === items[i].barcode) {
                items[i].count += item_count;
                return;
            }
        }
        allitems.forEach(data => {
            if(item_barcode === data.barcode) {
                items.push({
                    barcode: item_barcode,
                    name: data.name,
                    count: item_count,
                    unit: data.unit,
                    price: data.price    // 、、、、
                });
            }
        });
    });
    return items;
}
function get_promotion(items, discount) {
    let promotions = [];
    items.forEach(item => {
        if(discount[0].barcodes.includes(item.barcode )) {
        let promotion_count = Math.floor(item.count / 3);
        promotions.push({
            name: item.name,
            count: promotion_count,
            unit: item.unit
        });
        }
    });
    return promotions;
}
function get_menu(items, promotions) {
    let menu_top= "***<没钱赚商店>购物清单***\n";
    let menu_middle = "挥泪赠送商品：\n";
    let total = 0;
    let total_promotion = 0;
    let total_str = '';
    items.forEach(item => {
        let total_price = item.count * item.price;
        promotions.forEach(elem => {
            if(elem.name === item.name) {
            total_price -= elem.count * item.price;//优惠后的价格
            total_promotion += elem.count * item.price;   //优惠的价格
            menu_middle += '名称：'+ elem.name + '，数量：' + elem.count + item.unit + '\n' ;
            }
        });
        menu_top += '名称：'+ item.name + '，数量：' + item.count + item.unit + '，单价：' + item.price. toFixed(2)+'(元)，' +
            '小计：' + total_price.toFixed(2) +  '(元)\n' ;
        total += total_price;

    });
    total_str = '总计：' + total .toFixed(2)+ '(元)\n' + '节省：' + total_promotion.toFixed(2) + '(元) \n';
    let menu = menu_top +'----------------------\n'+ menu_middle +'----------------------\n'+ total_str +
        '**********************';
    return menu;
}