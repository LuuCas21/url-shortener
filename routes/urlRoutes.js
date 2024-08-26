import express from 'express';
import UrlModel from '../models/urlModel.js';
import isUrlHttp from 'is-url-http';
import { nanoid } from 'nanoid';

const router = express.Router();
const redirRouter = express.Router();

redirRouter.route('/')
.get((req, res) => {
    const data = req.cookies['url'];
    res.clearCookie('url');
    res.render('index', { url: data });
});

redirRouter.route('/:urlId')
.get(async (req, res) => {
    try {
        const url = await UrlModel.findOne({ urlId: req.params.urlId });

        if (url) {
        await UrlModel.updateOne({
            urlId: req.params.urlId,
        }, 
        {
            $inc: { clicks: 1 }
        });
        return res.redirect(url.origUrl);
    } else {
        res.status(404).json('Not found');
    }
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
})

router.route('/short')
.post(async (req, res) => {
    const { origUrl } = req.body;
    const base = process.env.BASE;
    const urlId = nanoid();

    if (isUrlHttp(origUrl)) {
        try {
            let url = await UrlModel.findOne({ origUrl });

            if (url) {
                res.cookie('url', url.shortUrl, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true
                });

                res.redirect('/');          
            } else {
                const shortUrl = `${base}/${urlId}`;

                url = new UrlModel({
                    origUrl,
                    shortUrl,
                    urlId,
                    date: new Date(),
                });

                await url.save();

                res.cookie('url', url.shortUrl, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true
                });

                //res.json(url);
                res.redirect('/')
            }
        } catch(err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).json('Invalid Original Url');
    }
});

export { router, redirRouter };