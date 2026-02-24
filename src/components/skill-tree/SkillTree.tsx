'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

interface ChapterNode {
  id: string;
  name: string;
  mastery: number;
  isUnlocked: boolean;
}

const CustomNode = ({ data }: { data: ChapterNode & { onClick: () => void } }) => {
  const getNodeStyle = () => {
    if (!data.isUnlocked) return 'bg-gray-800/80 border-gray-600 text-gray-500';
    if (data.mastery >= 80) return 'bg-green-500/20 border-green-500 text-green-400';
    if (data.mastery > 0) return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    return 'bg-blue-500/20 border-blue-500 text-blue-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={data.onClick}
      className={`px-4 py-3 rounded-xl border-2 backdrop-blur-sm cursor-pointer ${getNodeStyle()}`}
    >
      <div className="flex items-center gap-2">
        {!data.isUnlocked && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}
        <span className="font-medium text-sm">{data.name}</span>
      </div>
      {data.isUnlocked && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Mastery</span>
            <span>{data.mastery}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${data.mastery >= 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${data.mastery}%` }} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const nodeTypes = { custom: CustomNode };

interface SkillTreeProps {
  chapters: Array<{ id: string; name: string; prerequisites?: string[] }>;
  userProgress: Map<string, { mastery: number; isUnlocked: boolean }>;
  onChapterSelect: (chapterId: string) => void;
}

export function SkillTree({ chapters, userProgress, onChapterSelect }: SkillTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterNode | null>(null);

  useEffect(() => {
    const flowNodes: Node[] = chapters.map((chapter, index) => {
      const progress = userProgress.get(chapter.id) || { mastery: 0, isUnlocked: index === 0 };
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      return {
        id: chapter.id,
        type: 'custom',
        position: { x: col * 220 + 50, y: row * 150 + 50 },
        data: {
          ...chapter,
          mastery: progress.mastery,
          isUnlocked: progress.isUnlocked,
          onClick: () => setSelectedChapter({
            id: chapter.id,
            name: chapter.name,
            mastery: progress.mastery,
            isUnlocked: progress.isUnlocked,
          }),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    const flowEdges: Edge[] = [];
    chapters.forEach(chapter => {
      chapter.prerequisites?.forEach((prereqId: string) => {
        flowEdges.push({
          id: `${prereqId}-${chapter.id}`,
          source: prereqId,
          target: chapter.id,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [chapters, userProgress]);

  return (
    <div className="relative">
      <div className="h-[500px] bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#374151" gap={20} />
          <Controls className="bg-gray-800 border-gray-700 rounded-lg" />
        </ReactFlow>
      </div>

      {selectedChapter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 w-64 bg-gray-900/95 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex justify-between mb-3">
            <h3 className="font-bold text-white">{selectedChapter.name}</h3>
            <button onClick={() => setSelectedChapter(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Mastery</span>
              <span className={selectedChapter.mastery >= 80 ? 'text-green-400' : 'text-blue-400'}>{selectedChapter.mastery}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${selectedChapter.mastery >= 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${selectedChapter.mastery}%` }} />
            </div>
          </div>
          {selectedChapter.isUnlocked && (
            <button 
              onClick={() => onChapterSelect(selectedChapter.id)}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium"
            >
              {selectedChapter.mastery > 0 ? 'Continue' : 'Start'}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
