// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const _ = require("lodash");
const { name } = require("ejs");
// const date=require(__dirname+"/date.js");
const app = express();

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const WorkItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://himanshukr9052:himanshukr@cluster0.nuja6gq.mongodb.net/todolistDB");


const itemSchema = {
    name: String
};


const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to our todoList!"

});
const item2 = new Item({
    name: "Hit + button to save"

});
const item3 = new Item({
    name: "<--Hit this to delete an item"

});
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);


// Item.insertMany(

//     defaultItems
// ).then((connect) => {
//     console.log(connect);
// });
// Item.insertMany(defaultItems)
//     .then(function () {
//         console.log("Successfully saved defult items to DB");
//     })
//     .catch(function (err) {
//         console.log(err);
//     });
app.get("/", function (req, res) {

    Item.find({}).then((foundItems) => {
        // console.log(foundItems);
        if (foundItems.length === 0) {

            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("Successfully saved defult items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
            res.redirect("/");
        }
        else {
            res.render("list", {
                listTitle: "Today", newListItems: foundItems

            });
        }



        //  res.render("list", {
        //         listTitle: "Today", newListItems: foundItems

        //     });

    });
    // const day=date.getDate();

    // res.render("list", {
    //     listTitle: "Today", newListItems: foundItems

    // });

});

app.get("/:customListName", function (req, res) {

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }).then(function (foundList) {
        if (!foundList) {
            // creat new List
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName);

        } else {
            // Show existing List
            res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
        }
    }).catch(function (err) {
        console.log(err);
    });
});






// const list= new List({
//     name:customListName,
//     items:defaultItems
// });
// list.save();


// });







app.post("/", function (req, res) {

    // const item = req.body.newItem;



    // if (req.body.list === "Work") {
    //     WorkItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
    const itemName = req.body.newItem;

    const listName = req.body.list;

    const item = new Item({

        name: itemName

    });
    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);

        }).catch(function (err) {
            console.log(err);
        });
    }
         
    





    // item.save();
    // res.redirect("/");






});

app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemId).then(function () {
            console.log("Data deleted")  // Success
            res.redirect("/");
        }).catch(function (error) {
            console.log(error)      // Failure
        });
    }
    else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList, err) {
            if (!err) {
                res.redirect("/" + listName);
            }


        });

    }
});

// }

// Item.findByIdAndDelete(checkedItemId).then(function(){
//     console.log("Data deleted")  // Success
//     res.redirect("/");
// }).catch(function(error){
//     console.log(error)      // Failure
// });

// });


app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List", newListItems: WorkItems

    });

});
app.get("/about", function (req, res) {
    res.render("about");

});
app.post("/work", function (req, res) {

    const item = req.body.newItem;
    WorkItems.push(items);
    res.redirect("/work");


});





app.listen(3000, function () {

    console.log("server started on port 3000");
});