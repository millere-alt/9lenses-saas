import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const checkSubscription = (requiredTier) => {
  const tierHierarchy = {
    FREE: 0,
    BASIC: 1,
    PRO: 2,
    ENTERPRISE: 3
  };

  return (req, res, next) => {
    if (!req.user?.organization) {
      return res.status(403).json({ error: 'Organization required' });
    }

    const userTierLevel = tierHierarchy[req.user.organization.subscriptionTier];
    const requiredTierLevel = tierHierarchy[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        error: 'Subscription upgrade required',
        requiredTier,
        currentTier: req.user.organization.subscriptionTier
      });
    }

    next();
  };
};
