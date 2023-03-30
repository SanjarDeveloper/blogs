const express = require('express')
const app = express()
const fs = require('fs')
app.set('view engine', 'pug')

app.use('/static',express.static('public'))
app.use(express.urlencoded({extended: false}))

//get home page
app.get('/',(req,res) => {
    res.render('home')
})

//get create page
app.get('/create',(req,res) => {
        res.render('create')
})

//create new blog
app.post('/create',(req,res) => {
    const title = req.body.title
    const description = req.body.description
    if(title.trim() === '' || description.trim() === ''){
        res.render('create',{error: true})
    }else {
        fs.readFile('./data/blogs.json', (err, data) =>{
            if(err) throw err

            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs),err =>{
                if(err) throw err

                res.render('create', {success: true})
            })
        })
    }
})

//get all blogs
app.get('/blogs',(req,res) => {
    fs.readFile('./data/blogs.json',(err,data) =>{
        if(err) throw err

        const blogs = JSON.parse(data)
        res.render('blogs',{blogs: blogs})
    })
})

//get one blog
app.get('/blogs/:id',(req,res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json',(err,data) =>{
        if(err) throw err

        const blogs = JSON.parse(data)
        
        const blog = blogs.filter(blog => blog.id == id)[0]

        res.render('detail', {blog: blog})
    })
    
})

//Update blog page
app.get('/blogs/update/:id',(req,res) => {
    const id = req.params.id
    
    fs.readFile('./data/blogs.json',(err,data) =>{
        if(err) throw err

        

        const blogs = JSON.parse(data)
        
        const blog = blogs.filter(blog => blog.id == id)[0]

        
        res.render('update', {blog: blog})
    })
})

//Update blog
app.post('/blogs/update/:id',(req,res) => {
    const id = req.params.id
    
    fs.readFile('./data/blogs.json',(err,data) =>{
        if(err) throw err
    
    const blogs = JSON.parse(data)
    
    const blog = blogs.filter(blog => blog.id === id)[0]

  
    
    const idxBlog = blogs.indexOf(blog)
    const titleOld = blog['title']
    const descriptionOld = blog['description']
console.log(titleOld)
    const titleNew = req.body.title
    const descriptionNew = req.body.description
    if(titleNew.trim() === '' || descriptionNew.trim() === '')
    {
        res.render('update',{blog: blog, error: true})
    }
    else 
    {
        if(titleOld == titleNew && descriptionOld == descriptionNew)
        {
            res.render('blogs',{success: true, blogs: blogs})
        }
        else 
        {
            if(titleOld == titleNew && descriptionOld != descriptionNew){
                fs.readFile('./data/blogs.json', (err, data) =>{
                    if(err) throw err
        
                    //Delete 
                    blogs.splice(idxBlog,1)
        
                    blogs.push({
                        id: id,
                        title: titleOld,
                        description: descriptionNew,
                    })
        
                    fs.writeFile('./data/blogs.json', JSON.stringify(blogs),err =>{
                        if(err) throw err
        
                        res.render('blogs', {success: true, blogs: blogs})
                    })
                })
            } 
            if(titleOld != titleNew && descriptionOld == descriptionNew){
                fs.readFile('./data/blogs.json', (err, data) =>{
                    if(err) throw err
        
                    //Delete 
                    blogs.splice(idxBlog,1)
        
                    blogs.push({
                        id: id,
                        title: titleNew,
                        description: descriptionOld,
                    })
        
                    fs.writeFile('./data/blogs.json', JSON.stringify(blogs),err =>{
                        if(err) throw err
        
                        res.render('blogs', {success: true, blogs: blogs})
                    })
                })
            } 
        }
        
    }
})
})

//Delete blog
app.get('/blogs/delete/:id',(req,res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json',(err,data) =>{
        if(err) throw err

        const blogs = JSON.parse(data)
        
        const filteredBlog = blogs.filter(blog => blog.id != id)

        fs.writeFile('./data/blogs.json',JSON.stringify(filteredBlog), (err) => {
            if(err) throw err

            res.render('blogs', {blogs: filteredBlog, deleted:true})
        })
        
    })
})

app.listen(8000, err => {
    if(err) console.log(err)

    console.log('Server is running on port 8000...')
})

function id (){
    return '_' + Math.random().toString(36).substr(2,9)
}