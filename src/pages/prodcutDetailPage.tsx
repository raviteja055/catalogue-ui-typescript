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
    // const { id } = useParams<{ id: string }>();
    const { id = "" } = useParams();

    const targetRef = useRef<HTMLDivElement>(null);
    const [getProducts, { loading, error, data }] = useLazyQuery<ProductData, ProductVariables>(
        GET_PRODUCT_DETAILS
    );

    const handleScroll = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (id) {
            getProducts({ variables: { searchText: id } });
        }
    }, [id]);

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
                        <h3>{data.getProductById.name}</h3>
                        <p>{data.getProductById.price}</p>
                        <Rating rating={showRating(data.getProductById.reviews)} handleScroll={handleScroll} />
                        <div><b>Color: </b>{data.getProductById.color}</div>
                        <div><b>Size: </b>{data.getProductById.size}</div>
                        <div><b>Material: </b>{data.getProductById.material}</div>
                        <div><b>brand: </b>{data.getProductById.brand}</div>
                        <div><b>weight: </b>{data.getProductById.weight}</div>

                        <div>{data.getProductById.description}</div>

                    </div>

                </div>
            }
            <div className='row' ref={targetRef}>
                <h3>User Reviews</h3>
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
