// tests/unit/lambdaHandler.spec.ts

import { lambdaHandler } from '@handler/handler';
import { handleUpload, handleGetImage, handleDeleteImage } from '@handler/router';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mocking the handler functions
jest.mock('@handler/router', () => ({
  handleUpload: jest.fn(),
  handleGetImage: jest.fn(),
  handleDeleteImage: jest.fn(),
}));

describe('lambdaHandler', () => {
  let event: APIGatewayProxyEventV2;

  beforeEach(() => {
    event = {
      rawPath: '',
      requestContext: {
        http: {
          method: '',
        },
      },
    } as unknown as APIGatewayProxyEventV2;
  });

  it('should call handleUpload for /upload POST request', async () => {
    // Arrange
    event.rawPath = '/upload';
    event.requestContext.http.method = 'POST';
    const mockResponse = { status: 200, message: 'Upload successful' };
    (handleUpload as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await lambdaHandler(event);

    // Assert
    expect(handleUpload).toHaveBeenCalledWith(event);
    expect(result).toEqual(mockResponse);
  });

  it('should call handleGetImage for /getImage GET request', async () => {
    // Arrange
    event.rawPath = '/getImage';
    event.requestContext.http.method = 'GET';
    const mockResponse = { status: 200, message: 'Image found', list: [] };
    (handleGetImage as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await lambdaHandler(event);

    // Assert
    expect(handleGetImage).toHaveBeenCalledWith(event);
    expect(result).toEqual(mockResponse);
  });

  it('should call handleDeleteImage for /delete DELETE request', async () => {
    // Arrange
    event.rawPath = '/delete';
    event.requestContext.http.method = 'DELETE';
    const mockResponse = { status: 200, message: 'Delete successful' };
    (handleDeleteImage as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await lambdaHandler(event);

    // Assert
    expect(handleDeleteImage).toHaveBeenCalledWith(event);
    expect(result).toEqual(mockResponse);
  });

  it('should return 400 for invalid path', async () => {
    // Arrange
    event.rawPath = '/invalid';
    event.requestContext.http.method = 'POST';

    // Act
    const result = await lambdaHandler(event);

    // Assert
    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid path or method');
  });

  it('should return 500 for internal server error', async () => {
    // Arrange
    event.rawPath = '/upload';
    event.requestContext.http.method = 'POST';
    (handleUpload as jest.Mock).mockRejectedValue(new Error('Internal error'));

    // Act
    const result = await lambdaHandler(event);

    // Assert
    expect(result.status).toBe(500);
    expect(result.message).toContain('An error occurred');
  });
});
