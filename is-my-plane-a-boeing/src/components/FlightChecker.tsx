'use client'

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Plane, ExternalLink, AlertCircle, Info, Shuffle } from "lucide-react"

interface FlightInfo {
  type: 'Boeing' | 'Not Boeing' | 'Not Found';
  aircraft?: string;
  origin?: {
    code: string;
    airport: string;
    city: string;
  };
  destination?: {
    code: string;
    airport: string;
    city: string;
  };
}

const checkFlight = async (flightNumber: string): Promise<FlightInfo> => {
  try {
    const response = await fetch(`http://localhost:5001/flight_info?flight_number=${flightNumber}`);
    if (!response.ok) {
      throw new Error('Flight not found');
    }
    const data = await response.json();
    const aircraftType = data.flight_info.aircraft.friendly_type;

    return {
      type: aircraftType.toLowerCase().includes('boeing') ? 'Boeing' : 'Not Boeing',
      aircraft: aircraftType,
      origin: data.flight_info.origin,
      destination: data.flight_info.destination,
    };
  } catch (error) {
    console.error('Error fetching flight info:', error);
    return { type: 'Not Found' };
  }
};

const generateRandomFlightNumber = (): string => {
  const flightNumbers = [
    'SWA1030', 'UAL2644', 'UAL435', 'AAL302', 'SWA2594', 'SWA2594',
    'DAL321', 'DAL2870', 'WJA1536', 'AAL742', 'DLH463',
    'AUA66', 'KLM672', 'BAW216', 'VIR46K', 'WPT1158', 'BAW2238',
    'AFR406', 'ETH734', 'PBD5922', 'VIR300', 'PIA248',
    'UAE1KM', 'QTR40P'
  ]
  return flightNumbers[Math.floor(Math.random() * flightNumbers.length)]
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

  const handleRebook = useCallback(async () => {
    setRebooking(true)
    setPartnerWebsiteOpened(false)
    try {
      // Open partner website in a new tab
      window.open('https://skiplagged.com/', '_blank')
      // Simulating a delay before updating the UI
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPartnerWebsiteOpened(true)
      // Reset the button state after 3 seconds
      setTimeout(() => {
        setPartnerWebsiteOpened(false)
      }, 3000)
    } catch (error) {
      console.error("An error occurred while opening partner website.")
    } finally {
      setRebooking(false)
    }
  }, [])

  const handleRandomFlight = () => {
    const randomFlight = generateRandomFlightNumber()
    setFlightNumber(randomFlight)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B1D4E5] to-[#E8F1F8] p-4">
      <Card className="w-full max-w-2xl mx-auto flex flex-col bg-white/90 backdrop-blur-sm border-2 border-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] transform perspective-1000 hover:rotate-y-1 transition-all duration-300 hover:shadow-[0_20px_30px_rgba(0,0,0,0.2)]">
        <CardHeader className="text-center py-4 bg-gradient-to-r from-[#4C8CBF] to-[#8CC8E8] text-white rounded-t-xl">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
            <Plane className="h-10 w-10 text-white transform -rotate-45 drop-shadow-md" />
            Boeing Flight or Not?
          </CardTitle>
          <CardDescription className="text-lg text-white drop-shadow">
            Check if your flight is on a Boeing airplane
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-6 p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-grow flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter flight number (e.g., AA1234)"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  required
                  className="flex-grow text-lg py-5 border-2 border-gray-300 rounded-xl shadow-inner"
                />
                <Button
                  type="button"
                  onClick={handleRandomFlight}
                  className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Generate random flight number"
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto text-lg py-5 px-6 bg-gradient-to-r from-[#4C8CBF] to-[#8CC8E8] text-white rounded-xl transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Check Flight'}
              </Button>
            </div>
          </form>
          <div className="flex-grow">
            {result ? (
              <div className={`w-full p-6 rounded-xl shadow-lg transform transition-all duration-300 ${
                result.type === 'Boeing' ? 'bg-[#E8F1F8] hover:bg-[#D1E5F0]' : 
                result.type === 'Not Boeing' ? 'bg-green-100 hover:bg-green-200' : 
                'bg-yellow-100 hover:bg-yellow-200'
              }`}>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    {result.type === 'Boeing' && (
                      <>
                        <AlertCircle className="text-orange-500 h-8 w-8 flex-shrink-0 drop-shadow" />
                        <span className="text-orange-700 text-2xl font-medium drop-shadow">This is a Boeing aircraft.</span>
                      </>
                    )}
                    {result.type === 'Not Boeing' && (
                      <>
                        <CheckCircle className="text-green-500 h-8 w-8 flex-shrink-0 drop-shadow" />
                        <span className="text-green-700 text-2xl font-medium drop-shadow">This is not a Boeing aircraft.</span>
                      </>
                    )}
                    {result.type === 'Not Found' && (
                      <>
                        <AlertCircle className="text-yellow-500 h-8 w-8 flex-shrink-0 drop-shadow" />
                        <span className="text-yellow-700 text-2xl font-medium drop-shadow">Flight not found.</span>
                      </>
                    )}
                  </div>
                  {result.aircraft && (
                    <p className={`text-center text-lg ${
                      result.type === 'Boeing' ? 'text-orange-600' : 'text-green-600'
                    } drop-shadow`}>
                      Aircraft assigned: {result.aircraft}
                    </p>
                  )}
                  {result.type !== 'Not Found' && result.origin && result.destination && (
                    <div className={`text-lg text-center drop-shadow ${
                      result.type === 'Boeing' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      <p>From: {result.origin.airport} ({result.origin.code})</p>
                      <p>To: {result.destination.airport} ({result.destination.code})</p>
                    </div>
                  )}
                  {result.type === 'Boeing' && (
                    <p className="text-orange-700 text-lg text-center drop-shadow">
                      You are flying on a Boeing aircraft. Be aware of recent safety concerns and consider exploring alternative options.
                    </p>
                  )}
                  {result.type === 'Not Boeing' && (
                    <p className="text-gray-600 text-lg text-center drop-shadow">
                      Your flight is not on a Boeing aircraft. You can proceed with your travel plans as usual.
                    </p>
                  )}
                  {result.type === 'Not Found' && (
                    <p className="text-gray-700 text-lg text-center drop-shadow">
                      If you don't have a flight booked, you can book a trip with our partner.
                    </p>
                  )}
                  {(result.type === 'Boeing' || result.type === 'Not Found') && (
                    <Button
                      onClick={handleRebook}
                      disabled={rebooking}
                      className="w-full bg-gradient-to-r from-[#4C8CBF] to-[#8CC8E8] hover:from-[#3A6D94] hover:to-[#6BA5C8] text-white text-lg py-3 mt-4 rounded-xl transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                      {rebooking ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Opening partner site...
                        </>
                      ) : partnerWebsiteOpened ? (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Partner site opened
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-5 w-5" />
                          {result.type === 'Boeing' ? 'Explore non-Boeing options' : 'Book a trip with our partner'}
                        </>
                      )}
                    </Button>
                  )}
                  {partnerWebsiteOpened && (
                    <p className="text-gray-600 text-sm text-center mt-2 drop-shadow">
                      Partner website opened in a new tab.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 space-y-3 bg-white/50 p-6 rounded-xl shadow-inner shadow-gray-200">
                <p className="text-xl font-semibold drop-shadow">How to use the Aircraft Checker:</p>
                <ol className="list-decimal list-inside text-left space-y-1 text-sm">
                  <li className="drop-shadow">Enter your flight number (e.g., AA1234) in the input field above, or click the random button to generate one.</li>
                  <li className="drop-shadow">Click the "Check Flight" button to see if your flight is on a Boeing aircraft.</li>
                  <li className="drop-shadow">If your flight is on a Boeing aircraft, you can explore alternative options with our partner.</li>
                </ol>
                <p className="text-xs italic mt-3 drop-shadow">Note: This tool is for informational purposes only. Always confirm details with your airline and make informed decisions about your travel plans.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500 py-3 bg-gray-100/50 rounded-b-xl">
          <div className="w-full flex items-center justify-center space-x-2">
            <Info className="h-4 w-4" />
            <span className="drop-shadow">Always verify with your airline for the most up-to-date details.</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}