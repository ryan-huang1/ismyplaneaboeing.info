'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Plane, ExternalLink, AlertCircle } from "lucide-react"

interface FlightInfo {
  type: 'Boeing' | 'Not Boeing' | 'Not Found';
  aircraft?: string;
}

const checkFlight = (flightNumber: string): Promise<FlightInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random()
      if (random < 0.33) {
        resolve({ type: 'Boeing', aircraft: ['Boeing 737 MAX', 'Boeing 787 Dreamliner', 'Boeing 777'][Math.floor(Math.random() * 3)] })
      } else if (random < 0.66) {
        resolve({ type: 'Not Boeing', aircraft: ['Airbus A320', 'Airbus A350', 'Embraer E175'][Math.floor(Math.random() * 3)] })
      } else {
        resolve({ type: 'Not Found' })
      }
    }, 1500)
  })
}

const simulateOpenPartnerWebsite = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

export default function Component() {
  const [flightNumber, setFlightNumber] = useState('')
  const [result, setResult] = useState<FlightInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [rebooking, setRebooking] = useState(false)
  const [partnerWebsiteOpened, setPartnerWebsiteOpened] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setPartnerWebsiteOpened(false)

    try {
      const flightInfo = await checkFlight(flightNumber)
      setResult(flightInfo)
    } catch (error) {
      setResult({ type: 'Not Found' })
    } finally {
      setLoading(false)
    }
  }

  const handleRebook = async () => {
    setRebooking(true)
    setPartnerWebsiteOpened(false)
    try {
      await simulateOpenPartnerWebsite()
      setPartnerWebsiteOpened(true)
    } catch (error) {
      console.error("An error occurred while opening partner website.")
    } finally {
      setRebooking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-4 mb-4">
            <Plane className="h-10 w-10 text-blue-500" />
            Flight Checker
          </CardTitle>
          <CardDescription className="text-xl">
            Check if your flight is on a Boeing airplane
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                type="text"
                placeholder="Enter flight number"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                required
                className="flex-grow text-lg py-6"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto text-lg py-6 px-8"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Check Flight'}
              </Button>
            </div>
          </form>
          {result && (
            <div className={`p-6 rounded-lg ${
              result.type === 'Boeing' ? 'bg-red-100' : 
              result.type === 'Not Boeing' ? 'bg-green-100' : 
              'bg-yellow-100'
            }`}>
              <div className="flex flex-row items-center justify-center space-x-4 mb-4">
                {result.type === 'Boeing' && (
                  <>
                    <XCircle className="text-red-500 h-8 w-8 flex-shrink-0" />
                    <span className="text-red-700 text-2xl font-medium">This is a Boeing aircraft.</span>
                  </>
                )}
                {result.type === 'Not Boeing' && (
                  <>
                    <CheckCircle className="text-green-500 h-8 w-8 flex-shrink-0" />
                    <span className="text-green-700 text-2xl font-medium">This is not a Boeing aircraft.</span>
                  </>
                )}
                {result.type === 'Not Found' && (
                  <>
                    <AlertCircle className="text-yellow-500 h-8 w-8 flex-shrink-0" />
                    <span className="text-yellow-700 text-2xl font-medium">Flight not found. Please check the number.</span>
                  </>
                )}
              </div>
              {result.aircraft && (
                <p className={`text-center text-lg ${
                  result.type === 'Boeing' ? 'text-red-600' : 'text-green-600'
                }`}>
                  Aircraft assigned: {result.aircraft}
                </p>
              )}
              {result.type === 'Boeing' && (
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 text-lg text-center">
                    If you prefer not to fly on a Boeing aircraft, you can explore rebooking options.
                  </p>
                  <Button
                    onClick={handleRebook}
                    disabled={rebooking || partnerWebsiteOpened}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6"
                  >
                    {rebooking ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Opening partner site...
                      </>
                    ) : partnerWebsiteOpened ? (
                      <>
                        <CheckCircle className="mr-2 h-6 w-6" />
                        Partner site opened
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-6 w-6" />
                        Explore rebooking options
                      </>
                    )}
                  </Button>
                  {partnerWebsiteOpened && (
                    <p className="text-gray-600 text-lg text-center">
                      Partner website opened in a new tab.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}