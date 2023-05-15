import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//get product details data
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
//get search product data

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
      availability
      launchDate
      dimensions {
        length
        width
        height
      }
    }
  }
`;
//filter product data
const FILTER_PRODUCTS = gql`
  query filterData($searchText: String!) {
    filterData(input: { searchText: $searchText }) {
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
      launchDate
      dimensions {
        length
        width
        height
      }
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
    availability: boolean;
    image: string;
    launchDate: string;
}

const ProductListing = () => {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_DATA);
    const [searchText, setsearchText] = useState<string>("");
    const [getProducts, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_PRODUCTS);
    const [filterProducts, { loading: filterLoading, error: filterError, data: filterData }] = useLazyQuery(FILTER_PRODUCTS);

    const [productData, setProductData] = useState<Product[]>([]);
    const [sortOption, setSortOption] = useState<string>('');


    useEffect(() => {
        if (data) {
            setProductData(data.productDetailsData)
        }
    }, [data])
    useEffect(() => {
        if (sortOption) {
            if (sortOption == "launchLatest") {
                let sortedData = [...data.productDetailsData];
                sortedData.sort((a, b) => {
                    const dateA = new Date(a.launchDate).getTime();
                    const dateB = new Date(b.launchDate).getTime();
                    return dateB - dateA;
                });
                setProductData(sortedData)
            } else {
                filterProducts({ variables: { searchText: sortOption } });
            }
        }
    }, [sortOption]);


    useEffect(() => {
        if (searchData) {
            setProductData(searchData.searchProducts);
        }
    }, [searchData]);

    useEffect(() => {
        if (filterData) {
            setProductData(filterData.filterData);
        }
    }, [filterData]);
    const handleSearch = () => {
        getProducts({ variables: { searchText } });
    };
    const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };
    const handleReviewDate = (reviewDate: string): string => {
        const date = new Date(reviewDate);
        const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
        const formattedDate = date.toLocaleString("en-US", options);
        return formattedDate;
    };


    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };
    if (loading || searchLoading || filterLoading) {
        return (
            <div className="container" style={{ marginTop: "5%", textAlign: "center" }}>
                <div className="logo-container">
                    <img className="logo" src="./../logo192.png" alt="React Logo" />
                </div>
            </div>
        );
    }

    if (error || searchError || filterError) {
        return (
            <div className="container" style={{ marginTop: "5%" }}>
                Error: {error ? error.message : searchError?.message}
            </div>
        );
    }


    return (
        <>
            <div className="container" style={{ marginTop: "5%" }}>
                <div className='productFilters'>
                    <div>
                        <input style={{ height: "35px" }} type="text" onChange={(e) => setsearchText(e.target.value)} />
                        <button onClick={handleSearch} type="button" className="btn btn-primary" style={{ marginLeft: "5px" }}>Search</button>
                    </div>
                    <div className="filters">
                        <div className="filter">
                            <label htmlFor="sortOption">Sort by: </label>
                            <select id="sortOption" style={{ height: "35px" }} value={sortOption} onChange={handleSortOptionChange}>
                                <option value=""></option>
                                <option value="priceLH">Price: Low to High</option>
                                <option value="priceHL">Price: High to Low</option>
                                <option value="availability">Available in Stock</option>
                                <option value="launchLatest">Latest Products</option>

                            </select>
                        </div>
                    </div>
                </div>
                {productData.map((item) => (
                    <div className="card productList" onClick={() => handleProductClick(item._id)} key={item._id}>
                        <div className='row no-gutters'>
                            <div className='col-sm-2'>
                                <img src={item.image} />
                            </div>
                            <div className='col-sm-7'>
                                <div style={{ textAlign: "left", padding: "15px" }}>
                                    <div className='productTitle'>
                                        <h5>{item.name} </h5> <p><b>Launch on:</b> {handleReviewDate(item.launchDate)}</p>
                                    </div>
                                    <p>{item.description}</p>
                                </div>
                                <div className='productData'>
                                    <div><span><b>Size: </b></span> <span>{item.size}</span></div>
                                    <div> <span><b>Material: </b></span><span> {item.material}</span></div>
                                    <div> <span><b>brand: </b></span><span>{item.brand}</span></div>

                                </div>
                            </div>
                            <div className='col-sm-3 checkoutContainer'>
                                <p>₹ {item.price}</p>
                                {item.availability === true ? (
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