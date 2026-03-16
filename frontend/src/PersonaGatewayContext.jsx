import React, { createContext, useContext, useState } from 'react'
import PersonaGateway from './components/PersonaGateway'

const GatewayContext = createContext()

export function usePersonaGateway() {
    return useContext(GatewayContext)
}

export function PersonaGatewayProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <GatewayContext.Provider value={() => setIsOpen(true)}>
            {children}
            <PersonaGateway isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </GatewayContext.Provider>
    )
}
