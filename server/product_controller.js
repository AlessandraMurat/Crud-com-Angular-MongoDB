var express  = require ('express');
var router = express.Router();
var Product = require('./product')



router.post('/', (req, res) => {
    let prod = new Product({
        name:req.body.name
    });

    prod.save((err, p) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(p);
        }
    })
})

router.get ('/', (req,res) => {
    Product.find().exec((err, prods) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(prods);
        }
    })
})



router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await Product.deleteOne({_id: id})
        res.status(200).send({});
    }
    catch(err) {
        res.status(500).send({msg:'Internal error', error:err})
    }
})


router.patch('/:id', (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        if (err) {
            res.status(500).send(err);
        } else if(!prod) {
            res.status(404).send({});
        } else {
            prod.name = req.body.name;
            prod.save()
                .then((p) => res.status(200).send(p))
                .catch((e) => res.status(500).send(e));
        }
    })
})


module.exports = router;



