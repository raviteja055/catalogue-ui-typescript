import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

import Rating from "../components/rating";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    color: string;
    image: string;
    size: string;
    material: string;
    brand: string;
    weight: string;
    reviews: Review[];
    availability: boolean
}

interface Review {
    title: string;
    rating: string;
    description: string;
    author: string;
    date: string;
}

interface ProductData {
    getProductById: Product;
}

interface ProductVariables {
    searchText: string;
}

const GET_PRODUCT_DETAILS = gql`
  query getProductById($searchText: String!) {
    getProductById(input: { searchText: $searchText }) {
      _id
      name
      description
      price
      color
      image
      size
      material
      brand
      weight
      availability
      dimensions {
        length
        width
        height
      }
      reviews {
        title
        rating
        description
        author
        date
      }
    }
  }
`;

const ProductDetailsPage: React.FC = () => {
    const { id = "" } = useParams();

    const targetRef = useRef<HTMLDivElement>(null);
    const [getProducts, { loading, error, data }] = useLazyQuery<ProductData, ProductVariables>(
        GET_PRODUCT_DETAILS
    );
    useEffect(() => {
        if (id) {
            getProducts({ variables: { searchText: id } });
        }
    }, [id]);

    const handleScroll = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const showRating = (reviews: Review[]): number => {
        let totalRating = 0;

        reviews.forEach((review) => {
            const rating = parseInt(review.rating);
            totalRating += rating;
        });

        let rating = totalRating / reviews.length;
        return rating;
    };

    if (loading) {
        return (
            <div className="container" style={{ marginTop: "5%", textAlign: "center" }}>
                <div className="logo-container">
                    <img className="logo" src="./../logo192.png" alt="React Logo" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ marginTop: "5%" }}>
                Error: {error.message}
            </div>
        );
    }

    console.log("data", data && data.getProductById);

    const handleReviewDate = (reviewDate: string): string => {
        const date = new Date(reviewDate);
        const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
        const formattedDate = date.toLocaleString("en-US", options);


        return formattedDate;
    };

    return (
        <div className="container productDetails" style={{ marginTop: "5%" }}>

            {data &&
                <div className='row'>
                    <div className='col-sm-6'><img src={data.getProductById.image} /> </div>
                    <div className='col-sm-6'>
                        <h4>{data.getProductById.name}</h4>
                        <div>{data.getProductById.price}</div>
                        <div className='productRatings'>
                            <Rating rating={showRating(data.getProductById.reviews)} handleScroll={handleScroll} />
                            <div onClick={handleScroll}> {data.getProductById.reviews.length} Reviews</div>
                        </div>
                        <hr />
                        <div> <b>Product Info </b></div>

                        <table className='productInfo'>
                            <tr><td><b>Color:     </b></td><td>{data.getProductById.color}</td></tr>
                            <tr><td><b>Size:      </b></td><td>{data.getProductById.size}</td></tr>
                            <tr><td><b>Material:   </b></td><td>{data.getProductById.material}</td></tr>
                            <tr><td><b>brand:   </b></td><td>{data.getProductById.brand}</td></tr>
                            <tr><td><b>weight:   </b></td><td>{data.getProductById.weight}</td></tr>

                        </table>
                        <hr />
                        <div> <b>Product Dimensions </b></div>
                        <div className='productDimensions'>
                            <div><span><b>Length:</b></span><span>{data.getProductById.color}</span></div>
                            <div> <span><b>Width:</b></span><span>{data.getProductById.color}</span></div>
                            <div><span><b>Height:</b></span><span>{data.getProductById.color}</span></div>
                        </div>
                        <hr />
                        <h4 >Product Description</h4>
                        <div>{data.getProductById.description}</div>
                        <div className='productListCheckout'>
                            {
                                data.getProductById.availability ? (
                                    <div>
                                        <button type="button" className="btn btn-primary">
                                            Add to Cart
                                        </button>
                                        <button type="button" className="btn btn-danger">
                                            Buy Now
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button type="button" className="btn btn-danger">
                                            Out of Stock
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                </div>
            }
            <div className='row' style={{ marginTop: "10px" }} ref={targetRef}>
                <h4>User Reviews</h4>
                {data && data.getProductById.reviews.map((i: Review) => (
                    <>
                        <div className='col-12'>
                            <i className="fas fa-user fa-2x text-secondary"></i> <span>{i.author}</span>
                        </div>
                        <div className='col-12' style={{ display: "flex" }}>
                            <Rating rating={Number(i.rating)} handleScroll={handleScroll} />
                            <b>{i.title}</b>
                        </div>
                        <div className='col-12'> Reviewed On {handleReviewDate(i.date)}</div>
                        <div className='col-12'>
                            {i.description}
                            <hr />
                        </div>
                    </>
                ))}
            </div>
        </div >
    )
}
export default ProductDetailsPage
