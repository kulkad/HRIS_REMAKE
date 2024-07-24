'use client'

// import node module libraries
import { useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// import hooks
import useMounted from 'hooks/useMounted';

const Logout = () => {
  const hasMounted = useMounted();
  const router = useRouter();

  useEffect(() => {
    if (hasMounted) {
      // Simulate logout process
      // Perform actual logout logic here, e.g., clearing session, removing tokens, etc.
      console.log("User logged out");
      // Redirect to login page after logout
      router.push('/authentication/login');
    }
  }, [hasMounted, router]);

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6 text-center">
            <div className="mb-4">
              <h1>Logout</h1>
              <p className="mb-6">You have been logged out successfully.</p>
            </div>
            {/* Button */}
            <div className="d-grid">
              <Button variant="primary" onClick={() => router.push('/authentication/login')}>
                Go to Login
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default Logout;
