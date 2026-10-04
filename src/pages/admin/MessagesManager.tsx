import { useState, useEffect } from 'react';
import { contactApi } from '../../services/api';
import { Mail, Trash2 } from 'lucide-react';

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    const res = await contactApi.getAll();
    if (res.success) setMessages(res.data!);
    setLoading(false);
  };

  if (loading) return <div className="py-20 text-center text-taupe">Loading messages...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="heading-serif text-3xl font-semibold text-espresso">Messages</h1>
        <p className="text-taupe text-sm">{messages.length} contact enquiries</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white border border-champagne/30 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-espresso">{msg.name}</p>
                <p className="text-sm text-taupe">{msg.email}</p>
              </div>
              <p className="text-xs text-taupe">{new Date(msg.createdAt).toLocaleDateString()}</p>
            </div>
            {msg.subject && (
              <p className="text-sm font-medium text-espresso mb-2">Re: {msg.subject}</p>
            )}
            <p className="text-sm text-taupe leading-relaxed">{msg.message}</p>
            <div className="mt-3 flex gap-2">
              <a href={`mailto:${msg.email}`}
                className="flex items-center gap-1 text-xs text-muted-gold hover:underline">
                <Mail size={12} /> Reply
              </a>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="bg-white border border-champagne/30 p-8 text-center text-taupe">
          No messages yet. Contact form submissions will appear here.
        </div>
      )}
    </div>
  );
}
