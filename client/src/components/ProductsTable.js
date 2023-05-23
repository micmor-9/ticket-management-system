import {Card, Table} from "react-bootstrap"

function ProductsTable(props) {
    return (
        <Card body={true}>
            <Card.Title>
                Products
                <small className="text-body-secondary float-end">GET /api/products/</small>
            </Card.Title>
            <Table responsive>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                </tr>
                </thead>
                <tbody>
                {props.products !== undefined && props.products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                    </tr>
                ))}
                {props.products === undefined && (
                    <p>cannot communicate with server</p>
                )}
                </tbody>
            </Table>
        </Card>
    );
}

export default ProductsTable;