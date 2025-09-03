import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Shuffle, RotateCcw, Info, Trophy } from 'lucide-react'
import './App.css'

// Biblioteca de referência de microrganismos
const microorganismLibrary = {
  blue: {
    name: "Lactobacillus acidophilus",
    type: "Bactéria Benéfica",
    color: "blue",
    description: "Probiótico essencial para a saúde intestinal",
    habitat: "Intestino humano, produtos fermentados",
    function: "Auxilia na digestão e fortalece o sistema imunológico"
  },
  yellow: {
    name: "Saccharomyces cerevisiae",
    type: "Fungo",
    color: "yellow", 
    description: "Levedura utilizada na produção de pão e cerveja",
    habitat: "Frutas, solo, produtos fermentados",
    function: "Fermentação alcoólica e produção de CO₂"
  },
  red: {
    name: "Escherichia coli patogênica",
    type: "Bactéria Patogênica",
    color: "red",
    description: "Cepa patogênica que pode causar infecções",
    habitat: "Intestino de mamíferos, água contaminada",
    function: "Pode causar doenças gastrointestinais"
  },
  green: {
    name: "Methanobrevibacter smithii",
    type: "Archaea",
    color: "green",
    description: "Microrganismo produtor de metano",
    habitat: "Intestino humano, ambientes anaeróbicos",
    function: "Produção de metano a partir de hidrogênio e CO₂"
  }
}

const colorMap = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-500", 
  red: "bg-red-500",
  green: "bg-green-500"
}

function App() {
  const [fragments, setFragments] = useState([])
  const [organizedFragments, setOrganizedFragments] = useState({
    blue: [],
    yellow: [],
    red: [],
    green: []
  })
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [draggedFragment, setDraggedFragment] = useState(null)

  // Gerar fragmentos aleatórios
  const generateFragments = () => {
    const colors = ['blue', 'yellow', 'red', 'green']
    const newFragments = []
    
    for (let i = 0; i < 9; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      newFragments.push({
        id: i,
        color: randomColor,
        sequence: generateRandomSequence()
      })
    }
    
    setFragments(newFragments)
    setOrganizedFragments({ blue: [], yellow: [], red: [], green: [] })
    setScore(0)
    setGameCompleted(false)
  }

  // Gerar sequência de DNA aleatória
  const generateRandomSequence = () => {
    const bases = ['A', 'T', 'G', 'C']
    let sequence = ''
    for (let i = 0; i < 12; i++) {
      sequence += bases[Math.floor(Math.random() * bases.length)]
    }
    return sequence
  }

  // Inicializar o jogo
  useEffect(() => {
    generateFragments()
  }, [])

  // Verificar se o jogo foi completado
  useEffect(() => {
    const totalOrganized = Object.values(organizedFragments).reduce((sum, arr) => sum + arr.length, 0)
    if (totalOrganized === 9) {
      setGameCompleted(true)
      calculateScore()
    }
  }, [organizedFragments])

  const calculateScore = () => {
    let newScore = 0
    Object.entries(organizedFragments).forEach(([color, frags]) => {
      frags.forEach(frag => {
        if (frag.color === color) {
          newScore += 10
        }
      })
    })
    setScore(newScore)
  }

  // Drag and Drop handlers
  const handleDragStart = (e, fragment) => {
    setDraggedFragment(fragment)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetColor) => {
    e.preventDefault()
    if (draggedFragment) {
      // Remover fragmento da lista original
      setFragments(prev => prev.filter(f => f.id !== draggedFragment.id))
      
      // Adicionar à área organizada
      setOrganizedFragments(prev => ({
        ...prev,
        [targetColor]: [...prev[targetColor], draggedFragment]
      }))
      
      setDraggedFragment(null)
    }
  }

  const handleFragmentReturn = (fragment, fromColor) => {
    // Remover da área organizada
    setOrganizedFragments(prev => ({
      ...prev,
      [fromColor]: prev[fromColor].filter(f => f.id !== fragment.id)
    }))
    
    // Retornar à lista original
    setFragments(prev => [...prev, fragment])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Jogo Metagenoma
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Organize os fragmentos de DNA por tipo de microrganismo
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={generateFragments} className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Novo Jogo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLibrary(!showLibrary)}
              className="flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              Biblioteca
            </Button>
          </div>
          {gameCompleted && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Parabéns! Pontuação: {score}/90</span>
            </div>
          )}
        </div>

        {/* Biblioteca de Referência */}
        {showLibrary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Biblioteca de Referência</CardTitle>
              <CardDescription>
                Conheça os microrganismos que você está organizando
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(microorganismLibrary).map(([color, organism]) => (
                  <div key={color} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded ${colorMap[color]}`}></div>
                      <Badge variant="outline">{organism.type}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{organism.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{organism.description}</p>
                    <p className="text-xs"><strong>Habitat:</strong> {organism.habitat}</p>
                    <p className="text-xs"><strong>Função:</strong> {organism.function}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Área de Fragmentos Desordenados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fragmentos de DNA para Organizar</CardTitle>
            <CardDescription>
              Arraste os fragmentos para as áreas correspondentes abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded-lg">
              {fragments.map((fragment) => (
                <div
                  key={fragment.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, fragment)}
                  className={`${colorMap[fragment.color]} text-white p-3 rounded-lg cursor-move hover:opacity-80 transition-opacity shadow-md`}
                >
                  <div className="text-xs font-mono">{fragment.sequence}</div>
                  <div className="text-xs mt-1 opacity-90">ID: {fragment.id}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Áreas de Organização */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(microorganismLibrary).map(([color, organism]) => (
            <Card key={color} className="min-h-[200px]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colorMap[color]}`}></div>
                  <CardTitle className="text-sm">{organism.type}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {organism.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, color)}
                  className="min-h-[120px] p-2 border-2 border-dashed border-gray-300 rounded-lg flex flex-wrap gap-2"
                >
                  {organizedFragments[color].map((fragment) => (
                    <div
                      key={fragment.id}
                      onClick={() => handleFragmentReturn(fragment, color)}
                      className={`${colorMap[fragment.color]} text-white p-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-xs`}
                    >
                      <div className="font-mono">{fragment.sequence}</div>
                      <div className="opacity-90">ID: {fragment.id}</div>
                      {fragment.color === color && (
                        <div className="text-green-200 text-xs">✓ Correto</div>
                      )}
                      {fragment.color !== color && (
                        <div className="text-red-200 text-xs">✗ Incorreto</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações sobre Metagenoma */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sobre Metagenoma</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed">
              O metagenoma é o estudo do material genético de comunidades inteiras de microrganismos 
              presentes em um ambiente. Esta técnica revolucionária permite analisar a diversidade 
              genética e funcional de todos os microrganismos (bactérias, vírus, fungos, etc.) 
              sem a necessidade de cultivá-los em laboratório. Neste jogo, você simula o processo 
              de organização e identificação de fragmentos de DNA encontrados em uma amostra metagenômica.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

