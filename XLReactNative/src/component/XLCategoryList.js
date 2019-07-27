/* eslint-disable react/self-closing-comp */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-string-refs */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
    View,
    FlatList,
    SectionList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    Animated,
} from "react-native";

const leftItemHeight = 46;
const rightSectionHeight = 44;
const rightSectionItemHeight = 81;

export default class XLCategoryList extends Component {
    static defaultProps = {
        style: null, ///列表大小style
        leftList: [],//左侧分类列表数组
        rightList: [],//右侧分类列表
        sectionItemClick: null,//点击右侧分组的item回调
        addButtonClick: null,//点击加号按钮回调
        scrollEnd: null,//右侧分类列表开始滚动离开顶部和回到顶部回调
    }

    constructor(props) {
        super(props);
        this.state = {
            leftSelectIndex: 0,
            rightSelectSection: 0,
            topAnimated: new Animated.Value(0),
            sectionArrayInfo: this.createSectionY(),
            isClick: false,//防止点击与滚动冲突，重复处理
        };
    }

    render() {
        return (
            <View style={this.props.style ? this.props.style : styles.container}>
                <View style={styles.leftContainer}>
                    <Animated.View style={[styles.moveBox, { top: this.state.topAnimated }]} />
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.props.leftList}
                        // bounces={false}
                        keyExtractor={(item, index) => item + index}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return this.renderItem(item, index);
                        }}
                        ItemSeparatorComponent={() => this.renderItemSeparator()}
                        ListFooterComponent={() => this.renderItemSeparator()}
                    />
                </View>
                <View style={styles.rightContainer}>
                    <SectionList
                        ref={'sectionList'}
                        sections={this.props.rightList}
                        // bounces={false}
                        keyExtractor={(item, index) => 'key' + index + item}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index, section }) => {
                            return this.renderSectionItem(item, index, section);
                        }}
                        renderSectionHeader={({ section }) => {
                            return this.renderSectionHeader(section);
                        }}
                        //滑动时调用
                        onScroll={this.sectionOnScroll.bind(this)}
                        ItemSeparatorComponent={() => this.renderItemSeparator()}
                        // 开始拖拽
                        onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
                        getItemLayout={(data, index) => {
                            return this.getSectionItemLayout(index);
                        }}

                    />
                </View>
            </View>
        );
    }

    renderSectionHeader(section) {
        return <View style={styles.sectionHeaderBox}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <View style={styles.sectionLine} />
        </View>;
    }

    renderSectionItem(item, index, section) {
        let hasSoldOut = item.hasSoldOut;
        return <View style={{ opacity: hasSoldOut ? 0.5 : 1 }}>
            <TouchableOpacity
                style={styles.sectionItemBox}
                activeOpacity={1}
                disabled={hasSoldOut}
                onPress={() => {
                    ///点击商品
                    this.props.sectionItemClick && this.props.sectionItemClick(item, index, section);
                }}
            >
                <View>
                    <Image style={styles.imageStyle} source={{ url: item.image }} />
                </View>
                <View style={{ flex: 1, height: 60, marginLeft: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.goodsName}>{item.name}</Text>
                        <Text style={styles.goodsDescText}>{item.goodsDesc}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={this.getHasDiscount(section.categoryId) ? styles.priceDiscountText : styles.priceText}>{'￥' + item.price}</Text>
                            {
                                this.getHasDiscount(section.categoryId) ? <Text style={styles.priceOriDiscountText}>{'￥' + item.discountPrice}</Text> : null
                            }
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            disabled={hasSoldOut}
                            onPress={() => {
                                this.props.addButtonClick && this.props.addButtonClick(item, index, section);
                            }}
                        >
                            <Image source={require('../source/image/addIcon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>;
    }

    renderItemSeparator() {
        return <View style={styles.separator} />;
    }

    renderItem(item, index) {
        return <TouchableOpacity
            style={[styles.leftItemBox, {
                backgroundColor: this.state.leftSelectIndex !== index ? '#f7f7f7' : '#fff'
            }]}
            onPress={() => {
                this.leftItemClick(index);
            }}
        >
            <Text style={this.state.leftSelectIndex === index ? styles.leftItemTextSelectStyle : styles.leftItemTextNormalStyle}>{item.name}</Text>
            {
                item.discountTitle && item.discountTitle.length > 0 ? <View style={styles.discountBox}><Text style={styles.discountText}>{item.discountTitle}</Text></View> : null
            }
        </TouchableOpacity>;
    }

    getSectionItemLayout(index) {
        let headerHeight = (index + 1) * rightSectionHeight;
        let cellsHeight = 0;
        for (let i = 0; i < this.props.rightList.length; i++) {
            if (i > index) {
                break;
            }
            const element = this.props.rightList[i];
            const list = element.data;
            cellsHeight = cellsHeight + list.length * rightSectionItemHeight;
        }
        return {
            index: index,
            offset: cellsHeight + headerHeight,
            length: rightSectionItemHeight,
        };
    }

    /**
     * 获取滚动右侧商品滚动至第几组
     * @param {滚动的垂直距离} offSetY 
     */
    getSectionIndex(offSetY) {
        for (let index = 0; index < this.state.sectionArrayInfo.length; index++) {
            const element = this.state.sectionArrayInfo[index];
            if (element.offSetY - rightSectionHeight <= offSetY && offSetY < element.offSetY + element.sectionHeight) {
                return index;
            }
        }
        return -1;
    }
    /**
     * 是否有打折
     */
    getHasDiscount(categoryId) {
        let hasDiscount = false;
        for (let index = 0; index < this.props.leftList.length; index++) {
            const element = this.props.leftList[index];
            if (element.categoryId === categoryId) {
                hasDiscount = element.discount < 1;
                break;
            }
        }
        return hasDiscount;
    }

    onScrollBeginDrag(e) {
        this.setState({
            isClick: false,
        });
    }

    sectionOnScroll(e) {
        var offSetY = e.nativeEvent.contentOffset.y + 2;
        //开始滚动广告的条件
        this.props.scrollEnd && this.props.scrollEnd(offSetY > 50);
        ///点击不处理
        if (this.state.isClick) {
            return;
        }
        //拖拽的滚动处理
        let leftSelectIndex = this.getSectionIndex(offSetY);
        if (leftSelectIndex >= 0 && leftSelectIndex !== this.state.leftSelectIndex) {
            this.moveViewAnimated(leftSelectIndex * (leftItemHeight + 1));
            this.setState({
                leftSelectIndex: leftSelectIndex,
            });
        }
    }

    leftItemClick(index) {
        if (this.props.needScrollToEnd) {
            this.props.scrollEnd && this.props.scrollEnd();
        }
        let viewOffset = 0;
        for (let i = 0; i < index; i++) {
            viewOffset = viewOffset + 30;
            let data = this.props.rightList[i].data;
            viewOffset = viewOffset + data.length * rightSectionItemHeight;
        }
        this.refs.sectionList.scrollToLocation(
            {
                animated: true,
                itemIndex: 0,
                viewOffset: viewOffset,
                sectionIndex: index
            });
        this.setState({
            leftSelectIndex: index,
            isClick: true,
        });
        this.moveViewAnimated(index * (leftItemHeight + 1));
    }

    moveViewAnimated(top) {
        Animated.parallel([
            Animated.timing(
                this.state.topAnimated,
                {
                    duration: 200,
                    toValue: top
                }
            ),
        ]).start();
    }
    createSectionY() {
        let array = [];
        let lastY = 0;
        for (let index = 0; index < this.props.rightList.length; index++) {
            const element = this.props.rightList[index];
            let offSetY = lastY;
            let sectionHeight = rightSectionHeight + element.data.length * rightSectionItemHeight;
            let obj = {
                index: index,
                categoryId: element.categoryId,
                offSetY: lastY,
                sectionHeight: sectionHeight,
            };
            lastY = offSetY + sectionHeight;
            array.push(obj);
        }
        return array;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    leftContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
    },
    rightContainer: {
        flex: 5,
        backgroundColor: '#fff',
    },
    moveBox: {
        backgroundColor: '#4A70E4',
        width: 4,
        height: leftItemHeight + 1,
    },
    leftItemBox: {
        height: leftItemHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        backgroundColor: '#f1f1f1',
        height: 1,
        marginLeft: 0,
    },
    leftItemTextSelectStyle: {
        color: '#333',
        fontSize: 13,
        fontWeight: 'bold',
    },
    leftItemTextNormalStyle: {
        color: '#666',
        fontSize: 13,
    },
    discountBox: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 2,
        backgroundColor: '#FF4500',
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
    },
    sectionHeaderBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: rightSectionHeight,
    },
    sectionTitle: {
        color: '#333',
        marginHorizontal: 10,
        fontSize: 13,
        fontWeight: 'bold'
    },
    sectionLine: {
        height: 1,
        backgroundColor: '#f1f1f1',
        flex: 1,
    },
    sectionItemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    goodsDescText: {
        color: '#999',
        fontSize: 10,
        lineHeight: 18
    },
    priceNormalText: {
        color: '#333',
        fontSize: 14,
    },
    priceDiscountText: {
        color: '#FF4500',
        fontSize: 14,
    },
    priceOriDiscountText: {
        color: '#999',
        fontSize: 11,
        marginLeft: 5,
        textDecorationLine: 'line-through',
    },
    goodsName: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold'
    },
    imageStyle: {
        width: 60,
        height: 60,
        borderRadius: 5
    }
});