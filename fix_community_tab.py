import os

file_path = r"e:\Projects\Edu-event-Link\src\pages\Community.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target_states = "    const [blogs, setBlogs] = useState([]);"
replacement_states = """    const [blogs, setBlogs] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({});"""

content = content.replace(target_states, replacement_states)

target_fetch = """            // Fetch Blogs
            const blogsRes = await authFetch('/api/blogs');
            if (blogsRes.ok) {
                const blogsData = await blogsRes.json();
                setBlogs(blogsData);
            }"""

replacement_fetch = """            // Fetch Blogs
            const blogsRes = await authFetch('/api/blogs');
            if (blogsRes.ok) {
                const blogsData = await blogsRes.json();
                setBlogs(blogsData);
            }

            // Fetch Communities
            const commsRes = await authFetch('/api/communities');
            if (commsRes.ok) {
                const commsData = await commsRes.json();
                setCommunities(commsData);
                
                // Fetch pending requests for communities where current user is creator
                for (const c of commsData) {
                    if (c.is_creator && c.privacy === 'private') {
                        const pendRes = await authFetch(`/api/communities/${c.id}/pending`);
                        if (pendRes.ok) {
                            const pendData = await pendRes.json();
                            setPendingRequests(prev => ({ ...prev, [c.id]: pendData }));
                        }
                    }
                }
            }"""

content = content.replace(target_fetch, replacement_fetch)

# Add action handlers
target_handlers_anchor = "    const handleToggleComments = async (postId) => {"
replacement_handlers = """    const handleJoinCommunity = async (communityId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/join`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                // Update communities list
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            membership_status: data.membership_status,
                            members_count: data.membership_status === 'approved' ? c.members_count + 1 : c.members_count
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error joining community:', err);
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/leave`, {
                method: 'POST'
            });
            if (response.ok) {
                // Update communities list
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            membership_status: 'none',
                            members_count: c.membership_status === 'approved' ? c.members_count - 1 : c.members_count
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error leaving community:', err);
        }
    };

    const handleApproveMember = async (communityId, targetUserId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/approve?target_user_id=${targetUserId}`, {
                method: 'POST'
            });
            if (response.ok) {
                // Update pending requests list
                setPendingRequests(prev => ({
                    ...prev,
                    [communityId]: prev[communityId].filter(u => u.user_id !== targetUserId)
                }));
                // Update members count
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            members_count: c.members_count + 1
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error approving member:', err);
        }
    };

    const handleToggleComments = async (postId) => {"""

content = content.replace(target_handlers_anchor, replacement_handlers)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Success: Community tab state and handlers integrated!")
