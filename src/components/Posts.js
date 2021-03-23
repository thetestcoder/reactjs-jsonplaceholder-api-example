import { Component } from 'react';
import List from './List';
import axios from 'axios';
import toastr from 'toastr';

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            post: {
                title: "",
                body: "",
                userId: 10
            },
            isEditing: false,
            temp_id: null
        }

        this.add = this.add.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.delete = this.delete.bind(this)
        this.edit = this.edit.bind(this)
        this.update = this.update.bind(this)
        this.fetchAll = this.fetchAll.bind(this)

        this.baseURL = "https://jsonplaceholder.typicode.com/"
    }



    componentDidMount() {
        this.fetchAll()
    }


    fetchAll() {
        axios.get(this.baseURL + 'posts')
            .then(res => this.setState({ posts: res.data }))
    }

    add(e) {
        e.preventDefault();
        axios.post(this.baseURL + "posts", this.state.post)
            .then(res => {
                this.setState({
                    post: {
                        title: "",
                        body: "",
                        userId: 10
                    },
                })
                toastr.success("Post Added Successfully")
            })
    }

    view(item) {
        alert(
            `
            Title = ${item.title}\n
            Description = ${item.body}
            `
        )
    }

    edit(id) {
        let post = this.state.posts.filter(post => post.id === id)[0]
        this.setState({
            isEditing: true,
            post: {
                title: post.title,
                userId: post.userId,
                body: post.body
            },
            temp_id: id
        })
    }

    update(e) {
        e.preventDefault();
        axios.put(this.baseURL + `posts/${this.state.temp_id}`, this.state.post)
            .then(res => {
                this.setState({
                    post: {
                        title: "",
                        body: "",
                        userId: 10
                    },
                    isEditing: false,
                    temp_id: null
                });
                this.fetchAll();
                toastr.info("Post Updated Successfully")
            })

    }

    delete(id) {
        axios.delete(this.baseURL + `posts/${id}`).then(res => {
            this.fetchAll();
            toastr.warning("Post deleted Successfully")
        })
    }

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value
        let post = this.state.post;
        post[name] = value;
        this.setState({ post: post });
    }


    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <form onSubmit={this.state.isEditing ? this.update : this.add} method="POST">
                            <div className="mb-2">
                                <input type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    value={this.state.post.title}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="mb-2">
                                <input type="text"
                                    name="userId"
                                    className="form-control"
                                    placeholder="Enter User ID"
                                    value={this.state.post.userId}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="mb-2">
                                <input type="hidden"
                                    name="id"
                                    className="form-control"
                                    value={this.state.post.id}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="mb-2">
                                <textarea type="text"
                                    name="body"
                                    className="form-control"
                                    placeholder="Enter Post Body"
                                    value={this.state.post.body}
                                    onChange={this.handleChange} ></textarea>
                            </div>
                            <input
                                type="submit"
                                className="btn btn-success"
                                value={this.state.isEditing ? "Update" : "Save"} />
                        </form>
                        <List
                            posts={this.state.posts}
                            delete={this.delete}
                            edit={this.edit}
                            view={this.view}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Posts;