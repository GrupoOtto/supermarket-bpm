const Influx = require('influx');
const _ = require('lodash');

const influx = new Influx.InfluxDB({
  host: 'influx',
  database: 'sales',
  schema: [{
    measurement: 'response_times',
    fields: {
      path: Influx.FieldType.STRING,
      duration: Influx.FieldType.INTEGER,
      status: Influx.FieldType.INTEGER
    },
    tags: ['ip']
  }, {
    measurement: 'opend',
    fields: {
      caseId: Influx.FieldType.INTEGER,
      total: Influx.FieldType.FLOAT
    },
    tags: ['user']
  }, {
    measurement: 'intent',
    fields: {
      product: Influx.FieldType.STRING,
      amount: Influx.FieldType.INTEGER,
      final: Influx.FieldType.FLOAT,
    },
    tags: ['user', 'coupon', 'case']
  }, {
    measurement: 'resolve',
    fields: {
      caseId: Influx.FieldType.INTEGER,
      email: Influx.FieldType.STRING
    },
    tags: ['user']
  }]
});

exports.timeLoggin = () => (req, res, next) => {
  const start = new Date().getTime();

  res.on('finish', async () => {
    const {
      ip,
      path
    } = req;
    const status = res.statusCode;
    const duration = new Date().getTime() - start;
    try {
      await influx.writePoints([{
        measurement: 'response_times',
        fields: {
          path,
          duration,
          status
        },
        tags: {
          ip
        }
      }]);
    } catch (err) {
      console.error(err)
    }
  });
    next()
}

exports.logOpen = async (products, caseId, total, user, coupon) => {
  try {
    influx.writePoints([{
      measurement: 'opend',
      fields: {
        caseId,
        total,
      },
      tags: {
        user
      }
    }])

    influx.writePoints(products.map(({
      _id: product,
      amount,
      final
    }) => ({
      mmeasurement: 'intent',
      fields: {
        product,
        amount,
        final
      },
      tags: {
        user,
        coupon,
        caseId
      }
    })))
  } catch (err) {
    console.error(err)
  }
}

exports.logEnd = async (caseId, email, user) => {
  try {
    influx.writePoints([{
      measurement: 'resolve',
      fields: {
        caseId,
        email
      },
      tags: {
        user
      }
    }])
  } catch (error) {
    console.error(error)
  }
}
