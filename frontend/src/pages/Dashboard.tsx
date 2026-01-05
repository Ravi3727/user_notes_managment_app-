import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Trash2, LogOut, Plus } from 'lucide-react';

interface Note {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}

const Dashboard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        try {
            const { data } = await api.post('/notes', { title, description });
            setNotes([...notes, data]);
            setTitle('');
            setDescription('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Ziksir Notes</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 hidden sm:block">{auth?.user?.email}</span>
                            <button
                                onClick={auth?.logout}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Create Note Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Plus size={24} className="text-blue-600" />
                        Create New Note
                    </h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleCreateNote}>
                        <div className="grid gap-4">
                            <input
                                type="text"
                                placeholder="Note Title"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 border-gray-200"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Note Description"
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 border-gray-200 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{note.title}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap break-words">{note.description}</p>
                            </div>
                            <div className="mt-4 flex justify-end pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                    aria-label="Delete note"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-lg">No notes yet. Create one above!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
