import ExpoModulesCore
import Argon2Swift

enum SaltEncoding: String, Enumerable {
    case hex
    case utf8
    case base64
}

enum Argon2Mode: String, Enumerable {
    case argon2i
    case argon2d
    case argon2id
    
    func getArgon2Mode() -> Argon2Type {
        switch self {
        case .argon2d:
          return .d
        case .argon2i:
          return .i
        case .argon2id:
          return .id
        }
      }
}

struct Argon2Config: Record {
    @Field
    var iterations: Int = 2
    
    @Field
    var memory: Int = 32 * 1024
    
    @Field
    var parallelism: Int = 1
    
    @Field
    var hashLength: Int = 32
    
    @Field
    var saltEncoding: SaltEncoding = .utf8
    
    @Field
    var mode: Argon2Mode = .argon2id
}

public class ExpoArgon2Module: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoArgon2")

      AsyncFunction("hashAsync") { (password: Either<String, Data>, salt: String, config: Argon2Config) in
          let saltData: Data? = switch config.saltEncoding {
          case .hex: Data(hexEncoded: salt)
          case .base64: Data(base64Encoded: salt)
          case .utf8: salt.data(using: .utf8)
          }
          
          guard let validSaltData = saltData else {
              throw InvalidSaltFormatException()
          }
          let saltObject = Salt(bytes: validSaltData)
          
          do {
            let result = if let password: String = password.get() {
              try Argon2Swift.hashPasswordString(
                password: password,
                salt: saltObject,
                iterations: config.iterations,
                memory: config.memory,
                parallelism: config.parallelism,
                length: config.hashLength,
                type: config.mode.getArgon2Mode(),
              )
            } else if let password: Data = password.get() {
              try Argon2Swift.hashPasswordBytes(
                password: password,
                salt: saltObject,
                iterations: config.iterations,
                memory: config.memory,
                parallelism: config.parallelism,
                length: config.hashLength,
                type: config.mode.getArgon2Mode(),
              )
            } else {
              throw InvalidDataFormatException()
            }
              
              let encodedHash = result.encodedString()
              let rawHash = result.hexString()
              
              let resultDictionary = [
                "rawHash": rawHash,
                "encodedHash": encodedHash,
              ]
              return resultDictionary
              
          } catch {
              throw Argon2FailedException(error.localizedDescription)
          }
      }
  }
}

extension Data {
    init?(hexEncoded: String) {
        let hex = hexEncoded.replacingOccurrences(of: "0x", with: "")
        guard hex.count.isMultiple(of: 2) else {
            return nil
        }
        
        let chars = hex.map { $0 }
        let bytes = stride(from: 0, to: chars.count, by: 2)
            .map { String(chars[$0]) + String(chars[$0 + 1]) }
            .compactMap { UInt8($0, radix: 16) }
        
        guard hex.count / bytes.count == 2 else { return nil }
        self.init(bytes)
    }
}

final class InvalidSaltFormatException : Exception, @unchecked Sendable {
    override var reason: String {
        "Invalid salt format"
    }
}

final class InvalidDataFormatException : Exception, @unchecked Sendable {
  override var reason: String {
    "Invalid password data format"
  }
}

final class Argon2FailedException : GenericException<String>, @unchecked Sendable {
    override var reason: String {
        "Failed to generate Argon2 hash: \(param)"
    }
}
