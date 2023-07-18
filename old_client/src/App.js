import './App.css';
import React, {useEffect, useState} from "react";
import API from "./API";
import ProductsTable from "./components/ProductsTable";
import {Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Container, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProductSearch from "./components/ProductSearch";
import ProfileSearch from "./components/ProfileSearch";
import {ProfileActions, ProfileActionsMode} from "./components/ProfileActions";

Route.propTypes = {
    path: PropTypes.string,
    element: PropTypes.any
};

function App() {

    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [profileSearch, setProfileSearch] = useState("");
    const [modalError, setModalError] = useState("")

    useEffect(() => {
        function loadProducts() {
            API.getAllProducts().then((response) => {
                setProducts(response);

            }).catch(err => {
                setProducts(undefined)
                console.error(err.detail)
            })
        }

        loadProducts();
    }, []);

    const searchProductById = (id) => {
        return new Promise((resolve, reject) => {
            API.getProductById(id).then((product) => {
                setProductSearch(product);
                resolve(product)
            }).catch(err => {
                setProductSearch(undefined)
                console.error(err)
                reject(err)
            })
        })
    }

    const searchProfileByEmail = (email) => {
        return new Promise((resolve, reject) => {
            API.getProfileByEmail(email).then((profile) => {
                setProfileSearch(profile)
                resolve(profile)
            }).catch(err => {
                setProfileSearch(undefined)
                console.error(err)
                reject(err)
            });
        })
    }

    const addProfile = (profile) => {
        API.addProfile(profile).then((response) => {
            setModalError(response)
        }).catch(err => {
            setModalError(err)
        });
    }

    const updateProfile = (profile) => {
        API.updateProfile(profile).then((response) => {
            setModalError(response)
        }).catch(err => {
            setModalError(err)
        });
    }

    return (
        <Container className={"py-5 px-3"}>
            <Row>
                <ProductsTable products={products} searchProductById={searchProductById} productSearch={productSearch}/>
            </Row>
            <Row className={"my-4"}>
                <Col className={"ps-0"}>
                    <ProductSearch products={products} searchProductById={searchProductById}
                                   productSearch={productSearch} setProductSearch={setProductSearch}/>
                </Col>
                <Col className={"pe-0"}>
                    <ProfileSearch searchProfileByEmail={searchProfileByEmail} profileSearch={profileSearch}
                                   setProfileSearch={setProfileSearch}/>
                </Col>
            </Row>
            <Row className={"text-center"}>
                <Col></Col>
                <Col>
                    <ProfileActions action={ProfileActionsMode.CREATE} addProfile={addProfile} modalError={modalError}
                                    setModalError={setModalError}/>
                    <ProfileActions action={ProfileActionsMode.UPDATE} updateProfile={updateProfile}
                                    modalError={modalError} setModalError={setModalError}
                                    searchProfileByEmail={searchProfileByEmail}/>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
