'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  const [gameState, setGameState] = useState(null)
  const [driverId, setDriverId] = useState('')
  const [spotId, setSpotId] = useState('')
  const [guessType, setGuessType] = useState('occurred')
  const [apiResponse, setApiResponse] = useState(null)

  useEffect(() => {
    fetchGameState()
  }, [])

  const fetchGameState = async () => {
    const response = await fetch('/api/game')
    const data = await response.json()
    setGameState(data)
    setApiResponse(data)
  }

  const handleAssignDriver = async () => {
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'assign-driver', driverId: Number(driverId), spotId: Number(spotId) })
    })
    const data = await response.json()
    setApiResponse(data)
    fetchGameState()
  }

  const handleMakeGuess = async () => {
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'make-guess', guessType })
    })
    const data = await response.json()
    setApiResponse(data)
    fetchGameState()
  }

  const handleResetGame = async () => {
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-game' })
    })
    const data = await response.json()
    setApiResponse(data)
    fetchGameState()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">OLGAme API Tester</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Asignar Conductor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driverId">ID del Conductor</Label>
              <Input id="driverId" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="spotId">ID del Spot</Label>
              <Input id="spotId" value={spotId} onChange={(e) => setSpotId(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleAssignDriver} className="mt-4">Asignar Conductor</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Hacer Jugada</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="guessType">Tipo de Jugada</Label>
          <select
            id="guessType"
            value={guessType}
            onChange={(e) => setGuessType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="occurred">Ocurrió</option>
            <option value="not-occurred">No Ocurrió</option>
            <option value="occurred-in-order">Ocurrió en Orden</option>
          </select>
          <Button onClick={handleMakeGuess} className="mt-4">Hacer Jugada</Button>
        </CardContent>
      </Card>

      <Button onClick={handleResetGame} className="mb-4">Reiniciar Juego</Button>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="api-details">
          <AccordionTrigger>Detalles de la API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la API para Plasmic</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">GET /api/game</h3>
                <p>Obtiene el estado actual del juego.</p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`fetch('/api/game')
  .then(response => response.json())
  .then(data => console.log(data))`}
                </pre>

                <h3 className="text-lg font-semibold mb-2 mt-4">POST /api/game</h3>
                <p>Realiza acciones en el juego.</p>
                <h4 className="font-semibold mt-2">Asignar Conductor:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`fetch('/api/game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'assign-driver',
    driverId: 1, // ID del conductor
    spotId: 2 // ID del spot
  })
})
  .then(response => response.json())
  .then(data => console.log(data))`}
                </pre>
                <h4 className="font-semibold mt-2">Hacer Jugada:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`fetch('/api/game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'make-guess',
    guessType: 'occurred' // 'occurred', 'not-occurred', o 'occurred-in-order'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))`}
                </pre>
                <h4 className="font-semibold mt-2">Reiniciar Juego:</h4>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`fetch('/api/game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'reset-game' })
})
  .then(response => response.json())
  .then(data => console.log(data))`}
                </pre>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="game-state">
          <AccordionTrigger>Estado del Juego</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Estado del Juego</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(gameState, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="api-response">
          <AccordionTrigger>Respuesta de la API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Respuesta de la API</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}