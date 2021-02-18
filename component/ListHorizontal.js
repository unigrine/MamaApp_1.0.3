import React, { Component } from "react";
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../constants/themes/theme";
import { ScrollView } from "react-native-gesture-handler";

const CATEGORY_ICONS = [
  {
    "type": "all",
    
  }
]
class ListHorizontal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories
    }
  }

  componentDidMount() {
    this.setState({categories: this.props.categories})
  }

  onPressItem (item) {

    const { categories } = this.state
    let newCategories = []
    categories.map(p => {
      let newItem = {
        ...p,
        checked: false
      }
      if (p.id == item.id ) {
          newItem = {
          ...p,
          checked: true
        }
      }
      newCategories.push(newItem)
    })
    this.props.setCategories(newCategories)
  }

  renderItem (item) {
    return(
    <View key={item.key} style={{marginTop: 10, alignItems: "center", paddingHorizontal: 10}}>
      <TouchableOpacity style={[styles.circleWrapper, {backgroundColor: item.checked == true ? theme.primary: theme.grey0}]} onPress={()=>this.onPressItem(item)}>
        <Image
          source={item.icon}
          style={[{ width: 18, resizeMode: "contain" }, item.name == "전체" ? { width: 28 } : { width: 20 } ] }
        />
      </TouchableOpacity>
      <Text style={[styles.categoryname, {color: item.checked == true ? theme.black : theme.grey0}]}>{item.name}</Text>
    </View>
    )
  }

  render() {
    const { categories } = this.state
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
          {categories?.map((item, key) => {
            item.key = key
            return this.renderItem(item)
          })}
        </ScrollView>
    );
  }
}

export default ListHorizontal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  circleWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: theme.grey0,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryname: {
    color: theme.grey1,
    fontSize: theme.font14,
  }
})