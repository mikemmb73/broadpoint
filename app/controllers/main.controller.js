module.exports = {
        //show the homepage
        showHome: (req, res) => {
            //show employers first
            res.render('pages/home.ejs');
        }
};
