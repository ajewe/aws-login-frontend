const AWS = require('aws-sdk');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const USERS_TABLE = process.env.TABLE;

//if project adjusted to use local versions of AWS and DynamoDB, else is false when deployed
const dynamoDb = IS_OFFLINE === true ?
  new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    endpoint: 'http://127.0.0.1:8080',
  }) :
  new AWS.DynamoDB.DocumentClient();

const router = express.Router();

router.get('/users', (req, res) => {
  const params = {
      TableName: USERS_TABLE
  };

  dynamoDb.scan(params, (error, result) => {
      if (error) {
          res.status(400).json({ error: 'Error fetching the users' });
      }
      res.json(result.Items);
  });
});

//create a session
router.post('/session', (req, res) => {
  const { username, password } = req.body
  const params = {
    TableName: USERS_TABLE,
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username
    }
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      res.status(400).json({ error: 'Error retrieving user', error})
    }
    if (result.Items) {
      const hash = result.Items[0].hash
      bcrypt.compare(password, hash)
      .then(compareResult => {
        if (!compareResult) return res.status(400).send('Unauthorized');

        // user authenticated, create / send token back
        const timestamp = new Date().getTime();
        const data = { ...result.Items[0] };
        data.hash = 'REDACTED';
        const userObj = { userId: data.id, iat: timestamp };
        const token = jwt.sign(userObj, 'shh');
        res.json({ token: token, username: data.username })
      })
    } else {
      res.status(404).json({ error: `User not found` });
    }
  })
});

router.get('/users/:id', (req, res) => {
  const username = req.params.id;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      username
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      res.status(400).json({ error: 'Error retrieving user'})
    }
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: `User not found` });
    }
  });
});

const saltRounds = 10;

router.post('/users', (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    const params = {
      TableName: USERS_TABLE,
      Item: {
        username,
        hash,
        email,
        firstName,
        lastName
      },
    };

    dynamoDb.put(params, (error) => {
      if (error) {
        res.status(400).json({ error: 'Could not create user' });
      }
      res.json({
        username,
        hash,
        email,
        firstName,
        lastName
      });
    });
  })
});

router.delete('/users/:id', (req, res) => {
  const username = req.params.id;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      username
    }
  };

  dynamoDb.delete(params, (error) => {
    if (error) {
      res.status(400).json({ error: 'Could not delete user' });
    }
    res.json({ success: true });
  });
});

router.put('/users', (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        username
      },
      UpdateExpression: 'set hash = :hash, email = :email, firstName = :firstName, lastName = :lastName',
      ExpressionAttributeValues: { 
        ':hash': hash,
        ':email': email,
        ':firstName': firstName,
        ':lastName': lastName
      },
      ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
      if (error) {
        res.status(400).json({ error: 'Could not update user' });
      }
      res.json(result.Attributes);
    });
  })
});

module.exports = router;