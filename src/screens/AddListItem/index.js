import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Item from '../../components/Item';
import styles from './styles';
// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage"

// use hook to create database
const shopperDB = openDatabase({name: 'Shopper.db'});
const itemsTableName = 'items';

const AddListItemScreen = props => {

  const post = props.route.params.post;

  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
        // declare an empty array that will store the results of the
       // SELECT
       let results = [];
       // declare a transaction that will execute the SELECT
       shopperDB.transaction(txn => {
          // execute SELECT
          txn.executeSql(
            `SELECT * FROM ${itemsTableName}`,
            [],
            // callback function to handle the results from the
            // SELECT s
            (_, res) => {
              // get number of rows of data selected
              let len = res.rows.length;
              console.log('Length of items ' + len);
              // if more than one row was returned
              if (len > 0) {
                // loop through the rows
                for (let i=0; i < len; i++) {
                  // push a row of data at a time onto the
                  // results array
                  let item = res.rows.item(i);
                  results.push({
                    id: item.id,
                    name:  item.name,
                    price: item.price,
                    quantity: item.quantity,
                    list_id:  post.id,
                  });
                }
                // assign results array to lists state variable
                setItems(results);
                // [
                // \*    {
                //  id: 1
                //    name: Redner
                //    price: 5.99
                //    quantity: 2
                //    list_id: 2
                // },
                // {
                //    id: 2
                //    name: Silly watch
                //   price: 9.99
                 //  quantity: 3
                 //   list_id: 2
                // },
                //    id: 3
                //    name: Football
                //    price: 7.99
               //     quantity: 1
               //     list_id: 2
                // {
               //     id: 4
               //     name: GI Joe
               //     price: 5.99
               //     quantity: 2
               //     list_id: 2
                //   }, */
                // ]
              } else {
                // if no rows of data were returned,
                // set lists state variable to an empty array
                setItems([]);
              }
            },
            error => {
              console.log('Error getting items ' + error.message);
            },
          )
       });
    });
    return listener;
  });
  
  return (
    <View style={styles.container}>
      <View>
        <FlatList 
          data={items}
          renderItem={({item}) => <Item post={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

export default AddListItemScreen;