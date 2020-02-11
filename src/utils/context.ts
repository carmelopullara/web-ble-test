import { StateContextInterface } from './types';
import React, { createContext } from 'react'

export const StateContext: React.Context<StateContextInterface>  = createContext({} as StateContextInterface)
