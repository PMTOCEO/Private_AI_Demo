import jsPDF from 'jspdf';
import { Message } from '.';

interface ChatData {
  messages: Message[];
  chatTitle: string;
  expirationTime: number;
}

export function downloadChat(chat: ChatData, format: 'json' | 'txt' | 'pdf') {
  const { messages, chatTitle, expirationTime } = chat;
  const fileName = chatTitle.toLowerCase().replace(/\s+/g, '-');

  switch (format) {
    case 'json': {
      const data = {
        title: chatTitle,
        messages,
        createdAt: Date.now(),
        expiresAt: expirationTime,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `${fileName}.json`);
      break;
    }
    case 'txt': {
      const text = messages
        .map(m => `${m.role === 'user' ? 'You' : 'Pentos'}: ${m.content}`)
        .join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      downloadBlob(blob, `${fileName}.txt`);
      break;
    }
    case 'pdf': {
      const doc = new jsPDF();
      const margin = 20;
      let yPosition = 20;

      // Title
      doc.setFontSize(16);
      doc.setTextColor(88, 28, 135);
      doc.text(chatTitle, margin, yPosition);
      yPosition += 15;

      // Messages
      doc.setFontSize(12);
      messages.forEach(message => {
        const isUser = message.role === 'user';
        const timestamp = new Date(message.timestamp).toLocaleString();
        
        // Role and timestamp
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isUser ? 147 : 88, isUser ? 51 : 28, isUser ? 234 : 135);
        doc.text(`${isUser ? 'You' : 'Pentos'} - ${timestamp}`, margin, yPosition);
        yPosition += 7;

        // Message content
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);
        const lines = doc.splitTextToSize(message.content, 170);
        lines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += 7;
        });
        yPosition += 5;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });

      doc.save(`${fileName}.pdf`);
      break;
    }
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}