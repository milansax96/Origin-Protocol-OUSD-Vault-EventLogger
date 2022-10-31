import './App.css';
import {originContractAddress, provider, iface, dataGridColumns, createEventObject} from './utils/origin.utils.js';
import {useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {DataGrid} from '@mui/x-data-grid';
import LoadingOverlay from 'react-loading-overlay-ts';

function App() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const parseOriginLogs = () => {
        setLoading(true);
        const filterLog = {
            address: originContractAddress,
            fromBlock: 0,
            toBlock: 'latest'
        };
        const logPromise = provider.getLogs(filterLog);
        let counter = 0;
        logPromise.then((logs) => {
            logs.forEach((log) => {
                try {
                    const parsedLog = iface.parseLog({topics: log.topics, data: log.data.toString()});
                    const newEvent = createEventObject(log, parsedLog, counter);
                    counter += 1;
                    setEvents((events) => [newEvent, ...events]);
                } catch (e) {
                    console.log('Unknown Event: ' + e);
                }
            });
            setLoading(false);
        });
    }

    useEffect(() => {
        parseOriginLogs();
    }, []);

    return (
        <LoadingOverlay
            active={loading}
            spinner
            text='Fetching Event Logs...'
            styles={{overlay: (base) => ({
                    ...base,
                    height: 1000,
                    fontFamily: 'Lato',
                    fontSize: 24
            })}}
        >
            <Box sx={{
                height: 800,
                width: '100%',
                '& .blue-theme--header': {
                backgroundColor: '#0069d9',
                },
            }}>
                <img src="/ousd-coin.svg" alt="Origin Protocol"/>
                <Typography style={{
                    marginBottom: "2%",
                    fontWeight: 500,
                    fontSize: 36,
                    color: "white",
                    fontFamily: "Poppins",
                    textAlign: 'center'
                }}>OUSD Vault Event Logs</Typography>
                <DataGrid
                    rows={events}
                    columns={dataGridColumns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    sx={{color: "white", fontSize: 24, fontFamily: "Lato", '& .MuiTablePagination-root': {color: 'white'}}}
                />
            </Box>
        </LoadingOverlay>
    );
}

export default App;
