import re
p='src/pages/AdminDashboard.js'
with open(p,'r',encoding='utf-8') as f:
    text = f.read()

text = text.replace('let url = ${API_BASE_URL}/admin/orders?date=${selectedDate};', 'let url = `${API_BASE_URL}/admin/orders?date=${selectedDate}`;')
text = text.replace('url += &status=${selectedStatus};', 'url += `&status=${selectedStatus}`;')
text = text.replace('Authorization: Bearer ${token}', 'Authorization: `Bearer ${token}`')
text = text.replace('${API_BASE_URL}/admin/orders/${orderId}/status', '`${API_BASE_URL}/admin/orders/${orderId}/status`')
text = text.replace('className={status-badge status-${order.order_status}}', 'className={`status-badge status-${order.order_status}`}')
text = text.replace('key={${order.id}-${index}}', 'key={`${order.id}-${index}`}')

with open(p,'w',encoding='utf-8') as f:
    f.write(text)
