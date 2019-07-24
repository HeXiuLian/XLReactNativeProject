/* eslint-disable no-lone-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React, { Component } from "react";

import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity
} from "react-native";

const { width, height } = Dimensions.get("window");
const navigationBarHeight = Platform.OS === "ios" ? (height >= 812.0 ? 88 : 64) : 44;

export default class RootPage extends Component {
    static navigationOptions = {
        title: "demo"
    };
    constructor(props) {
        super(props);
        this.state = {
            data: ["广告视图", "日历"]
        };
    }

    render() {
        return (
            <View style={styles.containter}>
                <FlatList
                    style={styles.flastBox}
                    data={this.state.data}
                    keyExtractor={({ item, index }) => index + "List"}
                    renderItem={({ item, index }) => {
                        return this.renderItem(item, index);
                    }}
                    ItemSeparatorComponent={this.renderItemSeparatorComponent.bind(this)}

                />
            </View>
        );
    }
    renderItem(item, index) {
        return <TouchableOpacity
            onPress={() => {
                this.popToPage(index);
            }}
        >
            <View style={styles.itemBox}>
                <Text>{item}</Text>
            </View>
        </TouchableOpacity>;
    }
    renderItemSeparatorComponent() {
        return <View style={styles.lineStyle} />;
    }

    popToPage(index) {
        switch (index) {
            case 0: {
                this.props.navigation.navigate('bannerPage');
            }
                break;
            case 1: {

            }
                break;
            default: {

            }
        }
    }
}

const styles = StyleSheet.create({
    containter: {
        width: width,
        height: height - navigationBarHeight
    },
    flastBox: {
        flex: 1,
        backgroundColor: "#fff"
    },
    itemBox: {
        height: 50,
        alignItems: "center",
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    lineStyle: {
        backgroundColor: "#f0f0f0",
        height: 1
    }
});
