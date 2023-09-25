import { tokens } from "../../theme";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name", flex: 1 },
    ];

    return (
        <Box m="20px">
        <Header title="Products" subtitle="Products catalog" />
        <Box
            m="40px 0 0 0"
            height="70h"
            sx={{
            "& .MuiDataGrid-root": {
                border: "none",
            },
            "& .MuiDataGrid-cell": {
                borderBottom: "none",
            },
            "& .name-column--cell": {
                color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.greenAccent[700],
                borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.greenAccent[700],
            },
            "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiCircularProgress-root": {
                color: colors.greenAccent[700],
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: colors.grey[100],
            },
            "& .MuiDataGrid-panelWrapper .MuiButton-root": {
                color: colors.greenAccent[400] + " !important",
            },
            "& .MuiDataGrid-row": {
                cursor: "pointer",
            },
            }}
        >
            {/* <DataGrid
              rows={tickets}
              columns={columns}
              loading={!tickets.length}
              getRowId={(row) => row.id}
              slots={{
                toolbar: GridToolbar,
              }}
              sx={{
                height: "70vh",
              }}
              onRowClick={(row) => navigate(`/tickets/${row.id}`)}
            /> */}
        </Box>
    </Box>
    )

}


export default Products;