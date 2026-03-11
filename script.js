// 运单查询
function trackOrder() {
    const input = document.querySelector('input[placeholder="请输入运单号"]');
    const trackingNumber = input.value.trim();
    
    if (!trackingNumber) {
        alert('请输入运单号');
        return;
    }
    
    // 填充查询页面并跳转
    document.getElementById('trackingNumber').value = trackingNumber;
    document.getElementById('tracking').scrollIntoView({ behavior: 'smooth' });
    trackPackage();
}

// 运费估算（快速版）
function calculatePrice() {
    const fromCity = document.getElementById('fromCity').value.trim();
    const toCity = document.getElementById('toCity').value.trim();
    
    if (!fromCity || !toCity) {
        alert('请输入寄件城市和收件城市');
        return;
    }
    
    // 跳转到详细计算器
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('calcFromProvince').value = fromCity;
    document.getElementById('calcToProvince').value = toCity;
}

// 网点查询（快速版）
function searchNetwork() {
    const city = document.getElementById('networkCity').value.trim();
    
    if (!city) {
        alert('请输入城市或区域');
        return;
    }
    
    document.getElementById('network').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('networkSearch').value = city;
    searchNetworkPoints();
}

// 详细运费计算
function calculateDetailedPrice() {
    const fromProvince = document.getElementById('calcFromProvince').value;
    const toProvince = document.getElementById('calcToProvince').value;
    const weight = parseFloat(document.getElementById('calcWeight').value);
    const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
    
    if (fromProvince === '请选择' || toProvince === '请选择') {
        alert('请选择寄件和收件省份');
        return;
    }
    
    if (!weight || weight <= 0) {
        alert('请输入有效的重量');
        return;
    }
    
    // 计算运费
    let basePrice = 0;
    let pricePerKg = 0;
    
    // 根据服务类型定价
    switch(serviceType) {
        case 'standard':
            basePrice = 12;
            pricePerKg = 2;
            break;
        case 'express':
            basePrice = 18;
            pricePerKg = 3;
            break;
        case 'sameDay':
            basePrice = 30;
            pricePerKg = 5;
            break;
    }
    
    // 跨省加价
    if (fromProvince !== toProvince) {
        basePrice += 3;
    }
    
    const totalPrice = basePrice + (Math.max(0, weight - 1) * pricePerKg);
    
    // 显示结果
    document.getElementById('priceResult').classList.remove('hidden');
    document.getElementById('priceAmount').textContent = totalPrice.toFixed(2);
}

// 网点数据
const networkData = [
    { name: '朝阳营业点', address: '北京市朝阳区建国路88号', phone: '010-12345678', hours: '08:00-20:00' },
    { name: '海淀营业点', address: '北京市海淀区中关村大街1号', phone: '010-12345679', hours: '08:00-20:00' },
    { name: '东城营业点', address: '北京市东城区王府井大街168号', phone: '010-12345680', hours: '08:00-20:00' },
    { name: '西城营业点', address: '北京市西城区金融大街1号', phone: '010-12345681', hours: '08:00-20:00' },
    { name: '浦东营业点', address: '上海市浦东新区陆家嘴环路1000号', phone: '021-12345678', hours: '08:00-20:00' },
    { name: '黄浦营业点', address: '上海市黄浦区南京东路100号', phone: '021-12345679', hours: '08:00-20:00' },
    { name: '天河营业点', address: '广州市天河区天河路208号', phone: '020-12345678', hours: '08:00-20:00' },
    { name: '越秀营业点', address: '广州市越秀区中山五路193号', phone: '020-12345679', hours: '08:00-20:00' },
    { name: '福田营业点', address: '深圳市福田区福华三路168号', phone: '0755-12345678', hours: '08:00-20:00' },
    { name: '南山营业点', address: '深圳市南山区深南大道9966号', phone: '0755-12345679', hours: '08:00-20:00' },
    { name: '西湖营业点', address: '杭州市西湖区文三路478号', phone: '0571-12345678', hours: '08:00-20:00' },
    { name: '滨江营业点', address: '杭州市滨江区江南大道288号', phone: '0571-12345679', hours: '08:00-20:00' },
];

// 搜索网点
function searchNetworkPoints() {
    const keyword = document.getElementById('networkSearch').value.trim().toLowerCase();
    const listContainer = document.getElementById('networkList');
    
    let filtered = networkData;
    if (keyword) {
        filtered = networkData.filter(point => 
            point.name.toLowerCase().includes(keyword) ||
            point.address.toLowerCase().includes(keyword)
        );
    }
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-search text-4xl mb-4"></i>
                <p>未找到相关网点，请尝试其他城市</p>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = filtered.map(point => `
        <div class="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
                <h4 class="font-bold text-lg text-gray-900">${point.name}</h4>
                <span class="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">营业中</span>
            </div>
            <div class="space-y-2 text-gray-600">
                <div class="flex items-start">
                    <i class="fas fa-map-marker-alt text-orange-500 mt-1 mr-3"></i>
                    <span>${point.address}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-phone text-indigo-500 mr-3"></i>
                    <span>${point.phone}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-clock text-blue-500 mr-3"></i>
                    <span>${point.hours}</span>
                </div>
            </div>
            <button class="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                查看地图
            </button>
        </div>
    `).join('');
}

// 运单追踪
function trackPackage() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    
    if (!trackingNumber) {
        alert('请输入运单号');
        return;
    }
    
    // 显示结果区域
    document.getElementById('trackingResult').classList.remove('hidden');
    document.getElementById('displayTrackingNumber').textContent = trackingNumber;
    
    // 生成模拟物流信息
    const timeline = document.getElementById('trackingTimeline');
    const now = new Date();
    
    const events = [
        {
            time: formatDateTime(now),
            title: '运输中',
            desc: '快件已到达【北京转运中心】，正准备发往下一站',
            active: true
        },
        {
            time: formatDateTime(new Date(now - 2 * 60 * 60 * 1000)),
            title: '运输中',
            desc: '快件已离开【上海集散中心】，发往北京转运中心',
            active: false
        },
        {
            time: formatDateTime(new Date(now - 5 * 60 * 60 * 1000)),
            title: '已揽件',
            desc: '【上海市】浦东营业点 快递员已揽件',
            active: false
        },
        {
            time: formatDateTime(new Date(now - 6 * 60 * 60 * 1000)),
            title: '已下单',
            desc: '订单已创建，等待快递员揽件',
            active: false
        }
    ];
    
    timeline.innerHTML = events.map((event, index) => `
        <div class="relative flex items-start">
            <div class="absolute left-0 w-8 h-8 rounded-full ${event.active ? 'bg-indigo-600' : 'bg-gray-300'} flex items-center justify-center z-10">
                <i class="fas ${index === 0 ? 'fa-truck' : index === events.length - 1 ? 'fa-clipboard-list' : 'fa-check'} text-white text-sm"></i>
            </div>
            <div class="ml-12">
                <div class="text-sm text-gray-500 mb-1">${event.time}</div>
                <div class="font-bold ${event.active ? 'text-indigo-600' : 'text-gray-700'} mb-1">${event.title}</div>
                <div class="text-gray-600">${event.desc}</div>
            </div>
        </div>
    `).join('');
    
    // 滚动到结果
    document.getElementById('trackingResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 格式化日期时间
function formatDateTime(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', function() {
    // 初始化网点列表
    searchNetworkPoints();
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-xl');
    } else {
        nav.classList.remove('shadow-xl');
    }
});
