const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const { query } = require('express');
//import axios from 'axios';
const axios = require('axios');


app.get('/', (req, res) => {
    res.send('Server is running properly')
})

app.post('/', express.json(), (req, res) => {
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });
    function demo(agent) {
        agent.add("sending response from webhook server")
    }

    //Default Welcome Intent
    function defaultWelcomeIntent(agent) {
        agent.add('Hi! This is XYZ company bot, how may I help you?')
    }
    // Asking for order staus 
    function orderStatus(agent) {
        agent.add('Let me know your order ID?')
    }
    // provided with the order ID
    function orderID(agent) {
        agent.add(`Your order ${'@sys.number'} will be shipped by 20-Aug-2022`)
    }
    // Ending greeting
    function endGreeting(agent) {
        agent.add('Your Welcome!')
    }

    var intentMap = new Map();

    intentMap.set('WebhookDemo', demo)
    intentMap.set('Default Welcome Intent', defaultWelcomeIntent)
    intentMap.set('OrderStatus', orderStatus)
    // intentMap.set('Order ID', orderID)
    intentMap.set('End Greeting', endGreeting)
    intentMap.set('Order ID', getShipmentDate)

    agent.handleRequest(intentMap);
});

function getShipmentDate(agent) {
    const orderId = agent.parameters.id;

    console.log("order  : " + orderId);
    return axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {
        "orderId": orderId
    })
        .then(function (response) {
            console.log(response);
            const shipmentDate = response.data.shipmentDate;
            agent.add(`Your order ${orderId} will be shipped by ${shipmentDate}`)
        })
        .catch(function (error) {
            agent.add("NOT FOUND")
            console.log(error);
        });
    // return axios({

    //     method: 'post',
    //     url: 'https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus',
    //     data : {
    //         "orderId": orderId

    //     }
    //   })
    //   .then(function (response) {
    //     console.log(" then " + response.data.shipmentDate);
    //     agent.add(response.data.shipmentDate)

    // }) 
    // .catch(function(error){
    //     console.log( "Catch " + error)
    //     agent.add("Not found")

    // })
}
app.listen(5555, () => console.log('Server is running on port 5555'));