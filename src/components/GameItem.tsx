import React from 'react';
import {Link} from 'react-router-dom';

type blogData = {
    id : string,
    name : string
}


function BlogItem(blogData: blogData) {
    return (
      <div className="blog-item">
          <Link to={blogData.id}>{blogData.name}</Link>
      </div>
    );
  }
  
  export default BlogItem;