
import React, { useState, useEffect, useRef } from 'react';
import { SetView, Course } from '../types';
import { MOCK_COURSES } from '../data/courses';
import { useAuth } from '../hooks/useAuth';
import { startAITutorChat, sendAITutorMessage } from '../services/geminiService';
import { ChevronLeftIcon, SendIcon, BotIcon } from '../components/icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AITutor: React.FC<{ setView: SetView }> = ({ setView }) => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const studentCourses = MOCK_COURSES.filter(c => user?.courseIds?.includes(c.id));

  useEffect(() => {
    if (selectedCourse) {
      const courseContext = `Course: ${selectedCourse.title}. Description: ${selectedCourse.description}`;
      startAITutorChat(courseContext);
      setMessages([
        { sender: 'ai', text: `Hello! I'm your AI tutor for ${selectedCourse.title}. How can I help you understand the course material today?` }
      ]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await sendAITutorMessage(input);
    const aiMessage: Message = { text: aiResponseText, sender: 'ai' };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };


  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <button onClick={() => setView({ type: 'dashboard' })} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Select a Course for AI Tutoring</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCourses.map(course => (
            <Card key={course.id} onClick={() => setSelectedCourse(course)} className="p-6 text-center">
              <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">{course.title}</h2>
              <p className="text-secondary-500 mt-2">{course.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-150px)]">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline mb-4 self-start">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Change Course
        </button>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center">
            <BotIcon className="h-8 w-8 text-primary-500 mr-3"/>
            <h2 className="text-xl font-bold">AI Tutor: {selectedCourse.title}</h2>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-secondary-50 dark:bg-secondary-900">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === 'ai' && <Avatar src="https://picsum.photos/seed/bot/200" alt="AI" size="sm" />}
              <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white dark:bg-secondary-700 text-secondary-800 dark:text-secondary-100 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === 'user' && user && <Avatar src={user.avatar} alt={user.name} size="sm" />}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
               <Avatar src="https://picsum.photos/seed/bot/200" alt="AI" size="sm" />
               <div className="max-w-lg p-3 rounded-2xl bg-white dark:bg-secondary-700 rounded-bl-none">
                 <div className="flex items-center space-x-1">
                   <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your course..."
            className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-transparent focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''}>
            <SendIcon className="h-5 w-5"/>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AITutor;
