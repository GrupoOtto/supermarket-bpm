const Influx = require('influx');
const _ = require('lodash');

const influx = new Influx.InfluxDB({
  host: 'influx',
  database: 'sales',
  schema: [{
    measurement: 'response_times',
    fields: {
      duration: Influx.FieldType.INTEGER,
    },
    tags: ['ip', 'path', 'status']
  }, {
    measurement: 'leads',
    fields: {
      total: Influx.FieldType.FLOAT
    },
    tags: ['user', 'caseId']
  }, {
    measurement: 'sales',
    fields: {
      amount: Influx.FieldType.INTEGER,
      final: Influx.FieldType.FLOAT,
    },
    tags: ['user', 'product', 'coupon', 'caseId']
  }, {
    measurement: 'conversion',
    fields: {
      total: Influx.FieldType.FLOAT
    },
    tags: ['user', 'email', 'caseId']
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
          duration,
        },
        tags: {
          ip,
          path,
          status
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
      measurement: 'leads',
      fields: {
        total,
      },
      tags: {
        caseId,
        user
      }
    }])

    influx.writePoints(products.map(({
      _id: product,
      amount,
      final
    }) => ({
      measurement: 'sales',
      fields: {
        amount,
        final
      },
      tags: {
        user,
        product,
        coupon,
        caseId
      }
    })))
  } catch (err) {
    console.error(err)
  }
}

exports.logEnd = async (caseId, email, user, total) => {
  try {
    influx.writePoints([{
      measurement: 'conversion',
      fields: {
        total
      },
      tags: {
        user,
        caseId,
        email
      }
    }])
  } catch (error) {
    console.error(error)
  }
}
