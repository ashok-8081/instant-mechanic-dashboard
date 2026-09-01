// Add this to your backend mechanics routes
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, specialization, status } = req.body;
        
        // Check if mechanic already exists
        const existing = await Mechanic.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Mechanic with this email already exists'
            });
        }

        const mechanic = await Mechanic.create({
            name,
            email,
            phone,
            specialization,
            status: status || 'AVAILABLE',
            jobsCompleted: 0,
            rating: 0
        });

        res.status(201).json({
            success: true,
            data: mechanic
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});