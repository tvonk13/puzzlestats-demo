import React, { useState } from "react";
import Main from './Main';
import SyncContext from './Contexts/SyncContext';

function App() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <SyncContext.Provider value={[{isSyncing, progress}, {setIsSyncing, setProgress}]}>
            <Main />
        </SyncContext.Provider>
    )
}

export default App;