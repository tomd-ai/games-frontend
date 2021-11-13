import {Link} from 'react-router-dom';

type blogData = {
    id : string,
    name : string,
    url: string,
    biline: string
}


function BlogItem(blogData: blogData) {
    return (
    <Link to={blogData.id}>
      <div className="blog-item">
          
              {blogData.name}
              <p style={{fontSize:"smaller"}}>
                  {blogData.biline}
              </p>
      </div>
    </Link>
    );
  }
  
  export default BlogItem;