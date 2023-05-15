import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_DATA = gql`
  query productDetailsData {
    productDetailsData {
      _id
      name
      description
      price
      color
      size
      material
      brand
      weight
      dimensions {
        length
        width
        height
      }
      availability
      image
      launchDate
    }
  }
`;

const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchText: String!) {
    searchProducts(input: { searchText: $searchText }) {
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
    }
  }
`;

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    color: string;
    size: string;
    material: string;
    brand: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    availability: string;
    image: string;
    launchDate: string;
}

const ProductListing = () => {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_DATA);
    const [searchText, setsearchText] = useState<string>("");
    const [getProducts, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_PRODUCTS);

    const handleSearch = () => {
        getProducts({ variables: { searchText } });
    };
    const [productData, setproductData] = useState<Product[]>([]);

    useEffect(() => {
        console.log("datadata", data);
        if (data) {
            setproductData(data.productDetailsData);
        }
    }, [data]);

    useEffect(() => {
        console.log("datadata", searchData);
        if (searchData) {
            setproductData(searchData.searchProducts);
        }
    }, [searchData]);

    if (loading || searchLoading) {
        return (
            <div className="container" style={{ marginTop: "5%", textAlign: "center" }}>
                <div className="logo-container">
                    <img className="logo" src="./../logo192.png" alt="React Logo" />
                </div>
            </div>
        );
    }

    if (error || searchError) {
        return (
            <div className="container" style={{ marginTop: "5%" }}>
                Error: {error ? error.message : searchError?.message}
            </div>
        );
    }

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    return (
        <>
            <div className="container" style={{ marginTop: "5%" }}>

                <input onChange={(e) => setsearchText(e.target.value)} />
                <button onClick={handleSearch} type="button" className="btn btn-primary" style={{ marginLeft: "5px" }}>Search</button>

                {productData.map((item) => (
                    <div className="card productList" onClick={() => handleProductClick(item._id)} key={item._id}>
                        <div className='row no-gutters'>
                            <div className='col-sm-2'>
                                <img src={item.image} />
                            </div>
                            <div className='col-sm-7'>
                                <div style={{ textAlign: "left", padding: "15px" }}>  <h5>{item.name} </h5>
                                    <p>{item.description}</p>
                                </div>
                                <div className='productData'>
                                    <span><b>Size: </b>{item.size}</span>
                                    <span> <b>Material: </b> {item.material}</span>
                                    <span> <b>brand: </b>{item.brand}</span>

                                </div>
                            </div>
                            <div className='col-sm-3 checkoutContainer'>
                                <p>₹ {item.price}</p>
                                {item.availability === "true" ? (
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
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div >
        </>

    )
}

export default ProductListing